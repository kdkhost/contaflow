import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';

export class FinanceiroController {
  async listarContasPagar(request: FastifyRequest, reply: FastifyReply) {
    const { status, page = 1, limit = 50 } = request.query as Record<string, unknown>;
    const db = getDatabase();

    const where: Record<string, unknown> = { empresaId: request.user!.empresaId };
    if (status) where.status = status;

    const [contas, total] = await Promise.all([
      db.contasPagar.findMany({
        where,
        orderBy: { dataVencimento: 'asc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      db.contasPagar.count({ where }),
    ]);

    return reply.send({
      data: contas,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / (limit as number)) },
    });
  }

  async criarContaPagar(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const conta = await db.contasPagar.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(conta);
  }

  async pagarConta(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as { dataPagamento: string; formaPagamento: string };
    const db = getDatabase();

    const conta = await db.contasPagar.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    const atualizada = await db.contasPagar.update({
      where: { id },
      data: {
        status: 'PAGO',
        dataPagamento: new Date(body.dataPagamento),
        formaPagamento: body.formaPagamento as 'PIX',
        valorPago: conta.valor,
      },
    });

    return reply.send(atualizada);
  }

  async listarContasReceber(request: FastifyRequest, reply: FastifyReply) {
    const { status, page = 1, limit = 50 } = request.query as Record<string, unknown>;
    const db = getDatabase();

    const where: Record<string, unknown> = { empresaId: request.user!.empresaId };
    if (status) where.status = status;

    const [contas, total] = await Promise.all([
      db.contasReceber.findMany({
        where,
        orderBy: { dataVencimento: 'asc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      db.contasReceber.count({ where }),
    ]);

    return reply.send({
      data: contas,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / (limit as number)) },
    });
  }

  async criarContaReceber(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const conta = await db.contasReceber.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(conta);
  }

  async receberConta(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as { dataRecebimento: string; formaPagamento: string };
    const db = getDatabase();

    const conta = await db.contasReceber.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    const atualizada = await db.contasReceber.update({
      where: { id },
      data: {
        status: 'PAGO',
        dataRecebimento: new Date(body.dataRecebimento),
        formaPagamento: body.formaPagamento as 'PIX',
        valorRecebido: conta.valor,
      },
    });

    return reply.send(atualizada);
  }

  async conciliacaoBancaria(request: FastifyRequest, reply: FastifyReply) {
    const { contaBancariaId } = request.query as { contaBancariaId: string };
    const db = getDatabase();

    const movimentacoes = await db.movimentacaoBancaria.findMany({
      where: { contaBancariaId, conciliado: false },
      orderBy: { dataMovimento: 'asc' },
    });

    return reply.send({
      movimentacoes,
      total: movimentacoes.length,
      valorTotal: movimentacoes.reduce((acc, m) => acc + Number(m.valor), 0),
    });
  }

  async atualizarContaPagar(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const conta = await db.contasPagar.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    const atualizada = await db.contasPagar.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizada);
  }

  async excluirContaPagar(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const conta = await db.contasPagar.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    await db.contasPagar.delete({ where: { id } });
    return reply.status(204).send();
  }

  async atualizarContaReceber(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const conta = await db.contasReceber.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    const atualizada = await db.contasReceber.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizada);
  }

  async excluirContaReceber(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const conta = await db.contasReceber.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!conta) throw new AppError('Conta nao encontrada', 404);

    await db.contasReceber.delete({ where: { id } });
    return reply.status(204).send();
  }

  async fluxoCaixa(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    const db = getDatabase();

    const entradas = await db.contasReceber.aggregate({
      where: {
        empresaId: request.user!.empresaId,
        dataVencimento: {
          gte: new Date(`${competencia}-01`),
          lt: new Date(`${competencia}-01`).setMonth(new Date(`${competencia}-01`).getMonth() + 1),
        },
      },
      _sum: { valor: true },
    });

    const saidas = await db.contasPagar.aggregate({
      where: {
        empresaId: request.user!.empresaId,
        dataVencimento: {
          gte: new Date(`${competencia}-01`),
          lt: new Date(`${competencia}-01`).setMonth(new Date(`${competencia}-01`).getMonth() + 1),
        },
      },
      _sum: { valor: true },
    });

    return reply.send({
      competencia,
      entradas: entradas._sum.valor || 0,
      saidas: saidas._sum.valor || 0,
      saldo: Number(entradas._sum.valor || 0) - Number(saidas._sum.valor || 0),
    });
  }
}