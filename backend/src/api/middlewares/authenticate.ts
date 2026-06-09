import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';
import { config } from '../../utils/config';
import { JWTPayload } from './authMiddleware';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
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
}
