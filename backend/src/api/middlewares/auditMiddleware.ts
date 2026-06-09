import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';

export async function auditMiddleware(app: FastifyInstance) {
  app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) return;
      if (!request.url.startsWith('/api/')) return;
      if (request.url.includes('/health') || request.url.includes('/docs')) return;

      const db = getDatabase();
      const tempoResposta = Math.round(reply.elapsedTime);

      await db.logsAuditoria.create({
        data: {
          empresaId: request.user.empresaId,
          tenantId: request.user.tenantId,
          usuarioId: request.user.sub,
          acao: `${request.method} ${request.url}`,
          entidade: request.url.split('/')[3] || 'sistema',
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'] || '',
          endpoint: request.url,
          metodo: request.method,
          statusCode: reply.statusCode,
          tempoResposta,
        },
      });
    } catch {
      // Silenciar erros de auditoria
    }
  });
}

export async function registrarAuditoria(params: {
  empresaId: string;
  tenantId: string;
  usuarioId?: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  dadosAnteriores?: unknown;
  dadosNovos?: unknown;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    const db = getDatabase();
    await db.logsAuditoria.create({
      data: {
        empresaId: params.empresaId,
        tenantId: params.tenantId,
        usuarioId: params.usuarioId,
        acao: params.acao,
        entidade: params.entidade,
        entidadeId: params.entidadeId,
        dadosAnteriores: params.dadosAnteriores as Record<string, unknown>,
        dadosNovos: params.dadosNovos as Record<string, unknown>,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch {
    // Silenciar erros de auditoria
  }
}