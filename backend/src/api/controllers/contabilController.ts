import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';
import { registrarAuditoria } from '../middlewares/auditMiddleware';

const contaContabilSchema = z.object({
  codigo: z.string().min(1).max(20),
  descricao: z.string().min(1),
  tipo: z.enum(['ATIVO', 'PASSIVO', 'PATRIMONIO_LIQUIDO', 'RECEITA', 'DESPESA', 'CUSTO']),
  natureza: z.enum(['DEBITO', 'CREDITO', 'AMBOS']).optional(),
  contaPaiId: z.string().uuid().optional(),
  aceitaLancamento: z.boolean().optional(),
  centroCusto: z.boolean().optional(),
});

const lancamentoSchema = z.object({
  dataLancamento: z.string().transform((v) => new Date(v)),
  dataContabil: z.string().transform((v) => new Date(v)),
  descricao: z.string().min(1),
  valor: z.number().positive(),
  tipo: z.enum(['CREDITO', 'DEBITO']),
  contaContabilId: z.string().uuid(),
  numeroDocumento: z.string().optional(),
  competencia: z.string().regex(/^\d{4}-\d{2}$/),
  observacoes: z.string().optional(),
});

export class ContabilController {
  async listarContas(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const contas = await db.contasContabeis.findMany({
      where: { empresaId: request.user!.empresaId },
      include: { contasFilhas: true },
      orderBy: { codigo: 'asc' },
    });
    return reply.send(contas);
  }

  async criarConta(request: FastifyRequest, reply: FastifyReply) {
    const body = contaContabilSchema.parse(request.body);
    const db = getDatabase();

    const existente = await db.contasContabeis.findFirst({
      where: { empresaId: request.user!.empresaId, codigo: body.codigo },
    });

    if (existente) throw new AppError('Codigo de conta ja existe', 409, 'ACCOUNT_CODE_EXISTS');

    const conta = await db.contasContabeis.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
        natureza: body.natureza || 'AMBOS',
      },
    });

    await registrarAuditoria({
      empresaId: request.user!.empresaId,
      tenantId: request.user!.tenantId,
      usuarioId: request.user!.sub,
      acao: 'CRIAR',
      entidade: 'contas_contabeis',
      entidadeId: conta.id,
      dadosNovos: body,
      ipAddress: request.ip,
    });

    return reply.status(201).send(conta);
  }

  async obterConta(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();
    const conta = await db.contasContabeis.findFirst({
      where: { id, empresaId: request.user!.empresaId },
      include: { contasFilhas: true, contaPai: true },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404, 'ACCOUNT_NOT_FOUND');
    return reply.send(conta);
  }

  async atualizarConta(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = contaContabilSchema.partial().parse(request.body);
    const db = getDatabase();

    const conta = await db.contasContabeis.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404, 'ACCOUNT_NOT_FOUND');

    const atualizada = await db.contasContabeis.update({
      where: { id },
      data: body,
    });

    await registrarAuditoria({
      empresaId: request.user!.empresaId,
      tenantId: request.user!.tenantId,
      usuarioId: request.user!.sub,
      acao: 'ATUALIZAR',
      entidade: 'contas_contabeis',
      entidadeId: id,
      dadosAnteriores: conta,
      dadosNovos: atualizada,
      ipAddress: request.ip,
    });

    return reply.send(atualizada);
  }

  async excluirConta(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const conta = await db.contasContabeis.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404, 'ACCOUNT_NOT_FOUND');

    const lancamentos = await db.lancamentos.count({ where: { contaContabilId: id } });
    if (lancamentos > 0) {
      throw new AppError('Conta possui lancamentos e nao pode ser excluida', 400, 'ACCOUNT_HAS_ENTRIES');
    }

    await db.contasContabeis.delete({ where: { id } });

    await registrarAuditoria({
      empresaId: request.user!.empresaId,
      tenantId: request.user!.tenantId,
      usuarioId: request.user!.sub,
      acao: 'EXCLUIR',
      entidade: 'contas_contabeis',
      entidadeId: id,
      dadosAnteriores: conta,
      ipAddress: request.ip,
    });

    return reply.status(204).send();
  }

  async criarLancamento(request: FastifyRequest, reply: FastifyReply) {
    const body = lancamentoSchema.parse(request.body);
    const db = getDatabase();

    const conta = await db.contasContabeis.findFirst({
      where: { id: body.contaContabilId, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta contabil nao encontrada', 404, 'ACCOUNT_NOT_FOUND');
    if (!conta.aceitaLancamento) {
      throw new AppError('Esta conta nao aceita lancamentos', 400, 'ACCOUNT_NO_ENTRIES');
    }

    const lancamento = await db.lancamentos.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
        usuarioId: request.user!.sub,
      },
    });

    await registrarAuditoria({
      empresaId: request.user!.empresaId,
      tenantId: request.user!.tenantId,
      usuarioId: request.user!.sub,
      acao: 'CRIAR',
      entidade: 'lancamentos',
      entidadeId: lancamento.id,
      dadosNovos: body,
      ipAddress: request.ip,
    });

    return reply.status(201).send(lancamento);
  }

  async listarLancamentos(request: FastifyRequest, reply: FastifyReply) {
    const { competencia, status, page = 1, limit = 50 } = request.query as Record<string, unknown>;
    const db = getDatabase();

    const where: Record<string, unknown> = { empresaId: request.user!.empresaId };
    if (competencia) where.competencia = competencia;
    if (status) where.status = status;

    const [lancamentos, total] = await Promise.all([
      db.lancamentos.findMany({
        where,
        include: { contaContabil: true },
        orderBy: { dataLancamento: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      db.lancamentos.count({ where }),
    ]);

    return reply.send({
      data: lancamentos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / (limit as number)),
      },
    });
  }

  async atualizarLancamento(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const lancamento = await db.lancamentos.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!lancamento) throw new AppError('Lancamento nao encontrado', 404);

    const atualizado = await db.lancamentos.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizado);
  }

  async excluirLancamento(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const lancamento = await db.lancamentos.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!lancamento) throw new AppError('Lancamento nao encontrado', 404);

    await db.lancamentos.delete({ where: { id } });
    return reply.status(204).send();
  }

  async gerarDRE(request: FastifyRequest, reply: FastifyReply) {
    const { competenciaInicio, competenciaFim } = request.query as { competenciaInicio: string; competenciaFim: string };
    const db = getDatabase();

    const receitas = await db.lancamentos.aggregate({
      where: {
        empresaId: request.user!.empresaId,
        tipo: 'CREDITO',
        contaContabil: { tipo: 'RECEITA' },
        competencia: { gte: competenciaInicio, lte: competenciaFim },
        status: 'CONFIRMADO',
      },
      _sum: { valor: true },
    });

    const despesas = await db.lancamentos.aggregate({
      where: {
        empresaId: request.user!.empresaId,
        tipo: 'DEBITO',
        contaContabil: { tipo: 'DESPESA' },
        competencia: { gte: competenciaInicio, lte: competenciaFim },
        status: 'CONFIRMADO',
      },
      _sum: { valor: true },
    });

    const receitaTotal = receitas._sum.valor || 0;
    const despesaTotal = despesas._sum.valor || 0;

    return reply.send({
      receitas: receitaTotal,
      despesas: despesaTotal,
      lucroLiquido: Number(receitaTotal) - Number(despesaTotal),
      competenciaInicio,
      competenciaFim,
    });
  }

  async gerarBalanco(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    const db = getDatabase();

    const [ativos, passivos, patrimonioLiquido] = await Promise.all([
      db.lancamentos.aggregate({
        where: {
          empresaId: request.user!.empresaId,
          tipo: 'DEBITO',
          contaContabil: { tipo: 'ATIVO' },
          competencia,
          status: 'CONFIRMADO',
        },
        _sum: { valor: true },
      }),
      db.lancamentos.aggregate({
        where: {
          empresaId: request.user!.empresaId,
          tipo: 'CREDITO',
          contaContabil: { tipo: 'PASSIVO' },
          competencia,
          status: 'CONFIRMADO',
        },
        _sum: { valor: true },
      }),
      db.lancamentos.aggregate({
        where: {
          empresaId: request.user!.empresaId,
          tipo: 'CREDITO',
          contaContabil: { tipo: 'PATRIMONIO_LIQUIDO' },
          competencia,
          status: 'CONFIRMADO',
        },
        _sum: { valor: true },
      }),
    ]);

    return reply.send({
      ativoTotal: ativos._sum.valor || 0,
      passivoTotal: passivos._sum.valor || 0,
      patrimonioLiquido: patrimonioLiquido._sum.valor || 0,
      competencia,
    });
  }
}