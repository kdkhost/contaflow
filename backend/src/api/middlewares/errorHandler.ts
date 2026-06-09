import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { logger } from '../../utils/logger';

export function errorHandler(
  error: FastifyError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    ip: request.ip,
    user: request.user?.sub,
  });

  // Erro de validacao Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validacao',
      errors: error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Erros Fastify conhecidos
  if ('statusCode' in error) {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.code,
    });
  }

  // Erros genericos
  return reply.status(500).send({
    message: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
  });
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}