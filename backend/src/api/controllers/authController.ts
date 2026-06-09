import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../../core/auth/authService';
import { AppError } from '../middlewares/errorHandler';

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  empresaId: z.string().uuid(),
  role: z.enum(['ADMIN', 'CONTADOR_CHEFE', 'CONTADOR_ANALISTA', 'AUXILIAR', 'CLIENTE_VISUALIZACAO']).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const changePasswordSchema = z.object({
  senhaAtual: z.string(),
  novaSenha: z.string().min(6),
});

const loginSupervisionadoSchema = z.object({
  emailAlvo: z.string().email(),
  senhaAlvo: z.string().min(6),
  emailSupervisor: z.string().email(),
  senhaSupervisor: z.string().min(6),
});

export class AuthController {
  private authService = new AuthService();

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = loginSchema.parse(request.body);
    const tenantId = request.tenantId || request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new AppError('Tenant ID obrigatorio', 400, 'TENANT_REQUIRED');
    }

    const result = await this.authService.login({
      ...body,
      tenantId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return reply.status(200).send(result);
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = registerSchema.parse(request.body);
    const tenantId = request.tenantId || request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new AppError('Tenant ID obrigatorio', 400, 'TENANT_REQUIRED');
    }

    const usuario = await this.authService.register({
      ...body,
      tenantId,
    });

    return reply.status(201).send(usuario);
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const body = refreshTokenSchema.parse(request.body);
    const tokens = await this.authService.refreshToken(body.refreshToken);
    return reply.status(200).send(tokens);
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.split(' ')[1];
    await this.authService.logout(request.user?.sub, token);
    return reply.status(200).send({ message: 'Logout realizado com sucesso' });
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const body = changePasswordSchema.parse(request.body);
    await this.authService.changePassword(request.user!.sub, body.senhaAtual, body.novaSenha);
    return reply.status(200).send({ message: 'Senha alterada com sucesso' });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    const usuario = await db.usuarios.findUnique({
      where: { id: request.user!.sub },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        empresaId: true,
        tenantId: true,
        empresa: { select: { id: true, razaoSocial: true, nomeFantasia: true, cnpj: true } },
      },
    });

    if (!usuario) throw new AppError('Usuario nao encontrado', 404, 'USER_NOT_FOUND');
    return reply.status(200).send(usuario);
  }

  async loginSupervisionado(request: FastifyRequest, reply: FastifyReply) {
    const body = loginSupervisionadoSchema.parse(request.body);
    const tenantId = request.tenantId || request.headers['x-tenant-id'] as string;
    if (!tenantId) throw new AppError('Tenant ID obrigatorio', 400, 'TENANT_REQUIRED');

    const result = await this.authService.login({
      email: body.emailAlvo,
      senha: body.senhaAlvo,
      tenantId,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    return reply.status(200).send(result);
  }

  async listarUsuarios(request: FastifyRequest, reply: FastifyReply) {
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    const usuarios = await db.usuarios.findMany({
      where: { tenantId: (request.user as any)?.tenantId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        status: true,
        empresa: { select: { id: true, razaoSocial: true } },
      },
      orderBy: { nome: 'asc' },
    });
    return reply.status(200).send({ data: usuarios });
  }
}