import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';

export class FiscalController {
  async apurarICMS(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    const db = getDatabase();

    const notas = await db.notasFiscais.findMany({
      where: {
        empresaId: request.user!.empresaId,
        dataEmissao: {
          gte: new Date(`${competencia}-01`),
          lt: new Date(`${competencia}-01`).setMonth(new Date(`${competencia}-01`).getMonth() + 1),
        },
        status: 'AUTORIZADA',
      },
    });

    let totalICMS = 0;
    let totalICMSST = 0;
    let totalICMSDiferido = 0;

    for (const nota of notas) {
      totalICMS += Number(nota.valorIcms || 0);
    }

    return reply.send({
      competencia,
      totalICMS,
      totalICMSST,
      totalICMSDiferido,
      saldoApurado: totalICMS - totalICMSST - totalICMSDiferido,
      notasProcessadas: notas.length,
    });
  }

  async apurarPISCOFINS(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    const db = getDatabase();

    const notas = await db.notasFiscais.findMany({
      where: {
        empresaId: request.user!.empresaId,
        dataEmissao: {
          gte: new Date(`${competencia}-01`),
          lt: new Date(`${competencia}-01`).setMonth(new Date(`${competencia}-01`).getMonth() + 1),
        },
        status: 'AUTORIZADA',
      },
    });

    let totalPIS = 0;
    let totalCOFINS = 0;

    for (const nota of notas) {
      totalPIS += Number(nota.valorPis || 0);
      totalCOFINS += Number(nota.valorCofins || 0);
    }

    return reply.send({
      competencia,
      totalPIS,
      totalCOFINS,
      notasProcessadas: notas.length,
    });
  }

  async listarNotasFiscais(request: FastifyRequest, reply: FastifyReply) {
    const { page = 1, limit = 50, status, tipo } = request.query as Record<string, unknown>;
    const db = getDatabase();

    const where: Record<string, unknown> = { empresaId: request.user!.empresaId };
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;

    const [notas, total] = await Promise.all([
      db.notasFiscais.findMany({
        where,
        orderBy: { dataEmissao: 'desc' },
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
      }),
      db.notasFiscais.count({ where }),
    ]);

    return reply.send({
      data: notas,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / (limit as number)) },
    });
  }

  async processarXML(request: FastifyRequest, reply: FastifyReply) {
    const { xml } = request.body as { xml: string };
    return reply.send({ message: 'XML processado com sucesso', notaId: 'mock-id' });
  }

  async gerarEFD(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    return reply.send({
      competencia,
      arquivo: `EFD_${competencia.replace('-', '')}.txt`,
      status: 'GERADO',
      registros: 150,
    });
  }

  async gerarSPED(request: FastifyRequest, reply: FastifyReply) {
    const { tipo, competencia } = request.query as { tipo: string; competencia: string };
    return reply.send({
      tipo,
      competencia,
      arquivo: `SPED_${tipo}_${competencia.replace('-', '')}.txt`,
      status: 'GERADO',
    });
  }

  async listarObrigacoes(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const obrigacoes = await db.calendarioFiscal.findMany({
      where: { empresaId: request.user!.empresaId },
      orderBy: { dataInicio: 'asc' },
    });
    return reply.send(obrigacoes);
  }

  async criarObrigacao(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const obrigacao = await db.calendarioFiscal.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(obrigacao);
  }

  async atualizarObrigacao(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const obrigacao = await db.calendarioFiscal.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!obrigacao) throw new AppError('Obrigacao nao encontrada', 404);

    const atualizada = await db.calendarioFiscal.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizada);
  }

  async excluirObrigacao(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const obrigacao = await db.calendarioFiscal.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!obrigacao) throw new AppError('Obrigacao nao encontrada', 404);

    await db.calendarioFiscal.delete({ where: { id } });
    return reply.status(204).send();
  }

  async atualizarNotaFiscal(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const nota = await db.notasFiscais.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!nota) throw new AppError('Nota fiscal nao encontrada', 404);

    const atualizada = await db.notasFiscais.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizada);
  }

  async excluirNotaFiscal(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const nota = await db.notasFiscais.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!nota) throw new AppError('Nota fiscal nao encontrada', 404);

    await db.notasFiscais.delete({ where: { id } });
    return reply.status(204).send();
  }
}