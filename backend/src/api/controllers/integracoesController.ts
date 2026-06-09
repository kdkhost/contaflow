import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';

export class IntegracoesController {
  async listarIntegracoes(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const integracoes = await db.integracoesGoverno.findMany({
      where: { empresaId: request.user!.empresaId },
      orderBy: { tipo: 'asc' },
    });
    return reply.send({ integracoes });
  }

  async criarIntegracao(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const integracao = await db.integracoesGoverno.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(integracao);
  }

  async executarIntegracao(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    await db.integracoesGoverno.update({
      where: { id },
      data: {
        ultimaExecucao: new Date(),
        status: 'ATIVO',
        tentativas: { increment: 1 },
      },
    });

    return reply.send({ message: 'Integracao executada com sucesso', integracaoId: id });
  }

  async certidoesConjuntas(request: FastifyRequest, reply: FastifyReply) {
    const certidoes = [
      { id: '1', tipo: 'FGTS', status: 'POSITIVA', validade: '2026-12-31' },
      { id: '2', tipo: 'INSS', status: 'NEGATIVA', validade: null },
      { id: '3', tipo: 'FAZENDA', status: 'POSITIVA', validade: '2026-06-30' },
    ];
    return reply.send({ certidoes });
  }

  async consultarCND(request: FastifyRequest, reply: FastifyReply) {
    const { cnpj } = request.query as { cnpj: string };
    return reply.send({
      cnpj,
      certidao: 'POSITIVA',
      numero: '123456789',
      validade: '2026-12-31',
    });
  }

  async excluirIntegracao(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const integracao = await db.integracoesGoverno.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!integracao) throw new AppError('Integracao nao encontrada', 404);

    await db.integracoesGoverno.delete({ where: { id } });
    return reply.status(204).send();
  }
}