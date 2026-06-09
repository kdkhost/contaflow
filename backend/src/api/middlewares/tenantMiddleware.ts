import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId?: string;
    empresaId?: string;
  }
}

export async function tenantMiddleware(app: FastifyInstance) {
  app.addHook('preHandler', async (request: FastifyRequest) => {
    const tenantId = request.headers['x-tenant-id'] as string;
    const empresaId = request.headers['x-empresa-id'] as string;

    if (tenantId) {
      request.tenantId = tenantId;
    }
    if (empresaId) {
      request.empresaId = empresaId;
    }
  });
}

export function requireTenant(request: FastifyRequest, reply: FastifyReply) {
  if (!request.tenantId || !request.empresaId) {
    return reply.status(400).send({
      message: 'Tenant e empresa sao obrigatorios (headers x-tenant-id e x-empresa-id)',
    });
  }
}