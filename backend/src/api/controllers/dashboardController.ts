import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';

export class DashboardController {
  async resumo(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const empresaId = request.user!.empresaId;

    const [totalFuncionarios, totalNotas, totalContasPagar, totalContasReceber, eventosPendentes] =
      await Promise.all([
        db.funcionarios.count({ where: { empresaId, situacao: 'ATIVO' } }),
        db.notasFiscais.count({ where: { empresaId } }),
        db.contasPagar.count({ where: { empresaId, status: 'PENDENTE' } }),
        db.contasReceber.count({ where: { empresaId, status: 'PENDENTE' } }),
        db.eventosEsocial.count({ where: { empresaId, status: 'PENDENTE' } }),
      ]);

    const [valorPagar, valorReceber] = await Promise.all([
      db.contasPagar.aggregate({ where: { empresaId, status: 'PENDENTE' }, _sum: { valor: true } }),
      db.contasReceber.aggregate({ where: { empresaId, status: 'PENDENTE' }, _sum: { valor: true } }),
    ]);

    return reply.send({
      funcionariosAtivos: totalFuncionarios,
      totalNotasFiscais: totalNotas,
      contasAPagar: { quantidade: totalContasPagar, valor: valorPagar._sum.valor || 0 },
      contasAReceber: { quantidade: totalContasReceber, valor: valorReceber._sum.valor || 0 },
      eventosEsocialPendentes: eventosPendentes,
      fluxoCaixa: {
        saidas: valorPagar._sum.valor || 0,
        entradas: valorReceber._sum.valor || 0,
        saldo: Number(valorReceber._sum.valor || 0) - Number(valorPagar._sum.valor || 0),
      },
    });
  }

  async calendarioFiscal(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const agora = new Date();
    const proximoMes = new Date(agora);
    proximoMes.setMonth(proximoMes.getMonth() + 1);

    const eventos = await db.calendarioFiscal.findMany({
      where: {
        empresaId: request.user!.empresaId,
        dataFim: { gte: agora, lte: proximoMes },
      },
      orderBy: { dataFim: 'asc' },
    });

    return reply.send(eventos);
  }

  async notificacoes(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const notificacoes = await db.notificacoes.findMany({
      where: {
        empresaId: request.user!.empresaId,
        OR: [
          { usuarioId: request.user!.sub },
          { usuarioId: null },
        ],
      },
      orderBy: { criadoEm: 'desc' },
      take: 50,
    });

    return reply.send({ notificacoes });
  }

  async marcarNotificacaoLida(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const notificacao = await db.notificacoes.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!notificacao) throw new AppError('Notificacao nao encontrada', 404);

    const atualizada = await db.notificacoes.update({
      where: { id },
      data: { lida: true },
    });

    return reply.send(atualizada);
  }

  async criarNotificacao(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const notificacao = await db.notificacoes.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(notificacao);
  }

  async indicadores(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const empresaId = request.user!.empresaId;
    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

    const lancamentosMes = await db.lancamentos.count({
      where: { empresaId, competencia: mesAtual },
    });

    const notasProcessadas = await db.notasFiscais.count({
      where: { empresaId, processada: true },
    });

    const notasTotal = await db.notasFiscais.count({ where: { empresaId } });

    const [contasPagarPagas, contasPagarTotal, contasReceberRecebidas, contasReceberTotal] = await Promise.all([
      db.contasPagar.count({ where: { empresaId, status: 'PAGO' } }),
      db.contasPagar.count({ where: { empresaId } }),
      db.contasReceber.count({ where: { empresaId, status: 'PAGO' } }),
      db.contasReceber.count({ where: { empresaId } }),
    ]);

    const eficienciaOperacional = contasPagarTotal > 0 ? (contasPagarPagas / contasPagarTotal) * 100 : 0;
    const compliance = contasReceberTotal > 0 ? (contasReceberRecebidas / contasReceberTotal) * 100 : 0;

    return reply.send({
      lancamentosMes,
      taxaProcessamentoNotas: notasTotal > 0 ? (notasProcessadas / notasTotal) * 100 : 0,
      eficienciaOperacional: Math.round(eficienciaOperacional * 10) / 10,
      compliance: Math.round(compliance * 10) / 10,
    });
  }
}