import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import { config } from '../../utils/config';

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string;
  empresaId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authenticateRoles: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function authMiddleware(app: FastifyInstance) {
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Token de autenticacao nao fornecido' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verify(token, config.JWT_SECRET) as JWTPayload;

      request.user = decoded;
    } catch (error) {
      return reply.status(401).send({ message: 'Token invalido' });
    }
  });

  app.decorate('authenticateRoles', (roles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      if (!request.user) {
        return reply.status(401).send({ message: 'Nao autenticado' });
      }
      if (!roles.includes(request.user.role)) {
        return reply.status(403).send({ message: 'Sem permissao para esta acao' });
      }
    };
  });
}