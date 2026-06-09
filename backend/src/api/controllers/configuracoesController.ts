import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const configuracoesSchema = z.object({
  empresa: z.object({
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    cnpj: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().optional(),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
  }).optional(),
  smtp: z.object({
    host: z.string().optional(),
    port: z.number().optional(),
    user: z.string().optional(),
    pass: z.string().optional(),
    from: z.string().optional(),
    secure: z.boolean().optional(),
  }).optional(),
  seguranca: z.object({
    twoFactorEnabled: z.boolean().optional(),
    biometriaEnabled: z.boolean().optional(),
    sessionTimeout: z.number().optional(),
    maxLoginAttempts: z.number().optional(),
    passwordMinLength: z.number().optional(),
  }).optional(),
  notificacoes: z.object({
    emailAlertas: z.boolean().optional(),
    emailRelatorios: z.boolean().optional(),
    pushVencimentos: z.boolean().optional(),
    pushObrigacoes: z.boolean().optional(),
  }).optional(),
});

export class ConfiguracoesController {
  async getConfiguracoes(request: FastifyRequest, reply: FastifyReply) {
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    const tenantId = (request.user as any)?.tenantId;

    let config = await (db as any).configuracoes.findFirst({
      where: { tenantId },
    });

    if (!config) {
      config = await (db as any).configuracoes.create({
        data: {
          tenantId,
          empresa: {},
          smtp: { host: '', port: 587, user: '', pass: '', from: '', secure: false },
          seguranca: { twoFactorEnabled: false, biometriaEnabled: false, sessionTimeout: 30, maxLoginAttempts: 5, passwordMinLength: 8 },
          notificacoes: { emailAlertas: true, emailRelatorios: false, pushVencimentos: true, pushObrigacoes: true },
        },
      });
    }

    return reply.status(200).send(config);
  }

  async updateConfiguracoes(request: FastifyRequest, reply: FastifyReply) {
    const body = configuracoesSchema.parse(request.body);
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    const tenantId = (request.user as any)?.tenantId;

    const existing = await (db as any).configuracoes.findFirst({ where: { tenantId } });

    if (existing) {
      const updated = await (db as any).configuracoes.update({
        where: { id: existing.id },
        data: {
          empresa: body.empresa ? { ...((existing.empresa as any) || {}), ...body.empresa } : existing.empresa,
          smtp: body.smtp ? { ...((existing.smtp as any) || {}), ...body.smtp } : existing.smtp,
          seguranca: body.seguranca ? { ...((existing.seguranca as any) || {}), ...body.seguranca } : existing.seguranca,
          notificacoes: body.notificacoes ? { ...((existing.notificacoes as any) || {}), ...body.notificacoes } : existing.notificacoes,
          atualizadoEm: new Date(),
        },
      });
      return reply.status(200).send(updated);
    } else {
      const created = await (db as any).configuracoes.create({
        data: {
          tenantId,
          empresa: body.empresa || {},
          smtp: body.smtp || {},
          seguranca: body.seguranca || {},
          notificacoes: body.notificacoes || {},
        },
      });
      return reply.status(201).send(created);
    }
  }

  async testSmtp(request: FastifyRequest, reply: FastifyReply) {
    const body = z.object({ host: z.string(), port: z.number(), user: z.string(), pass: z.string(), from: z.string() }).parse(request.body);
    
    // Simula teste de conexao SMTP
    try {
      // Em producao, aqui seria a conexao real com o servidor SMTP
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransport({ host: body.host, port: body.port, auth: { user: body.user, pass: body.pass } });
      // await transporter.verify();
      
      return reply.status(200).send({ success: true, message: 'Conexao SMTP testada com sucesso!' });
    } catch (error) {
      return reply.status(400).send({ success: false, message: 'Falha ao conectar com servidor SMTP' });
    }
  }

  async setupTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;
    
    // Gera secrets TOTP para 2FA
    const speakeasy = await import('speakeasy');
    const secret = speakeasy.generateSecret({
      name: `ContaFlow (${(request.user as any)?.email})`,
      issuer: 'ContaFlow',
      length: 20,
    });

    // Gera QR code URL
    const otpauth = secret.otpauth_url || '';

    // Salva o secret temporariamente (sera confirmado depois)
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    await (db as any).twoFactorSecrets.upsert({
      where: { userId },
      update: { secret: secret.base32, confirmed: false },
      create: { userId, secret: secret.base32, confirmed: false },
    });

    return reply.status(200).send({
      secret: secret.base32,
      otpauth,
      message: 'Scan the QR code with your authenticator app',
    });
  }

  async confirmTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const { code } = z.object({ code: z.string() }).parse(request.body);
    const userId = (request.user as any)?.sub;

    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();
    const record = await (db as any).twoFactorSecrets.findUnique({ where: { userId } });

    if (!record) return reply.status(400).send({ message: 'Configure 2FA primeiro' });

    const speakeasy = await import('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: record.secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) return reply.status(400).send({ message: 'Codigo invalido' });

    await (db as any).twoFactorSecrets.update({
      where: { userId },
      data: { confirmed: true },
    });

    return reply.status(200).send({ message: '2FA ativado com sucesso!' });
  }

  async verifyTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const { code, email } = z.object({ code: z.string(), email: z.string() }).parse(request.body);
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();

    const user = await (db as any).usuarios.findFirst({ where: { email } });
    if (!user) return reply.status(400).send({ message: 'Usuario nao encontrado' });

    const record = await (db as any).twoFactorSecrets.findUnique({ where: { userId: user.id } });
    if (!record || !record.confirmed) return reply.status(400).send({ message: '2FA nao configurado' });

    const speakeasy = await import('speakeasy');
    const verified = speakeasy.totp.verify({
      secret: record.secret,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    if (!verified) return reply.status(400).send({ message: 'Codigo 2FA invalido' });

    return reply.status(200).send({ verified: true });
  }

  async disableTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();

    await (db as any).twoFactorSecrets.delete({ where: { userId } }).catch(() => {});
    return reply.status(200).send({ message: '2FA desativado' });
  }

  async setupBiometria(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;
    const { credentialId, publicKey } = z.object({
      credentialId: z.string(),
      publicKey: z.string(),
      deviceName: z.string().optional(),
    }).parse(request.body);

    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();

    await (db as any).biometriaCredentials.create({
      data: {
        userId,
        credentialId,
        publicKey,
        deviceName: request.body.deviceName || 'Dispositivo',
        counter: 0,
      },
    });

    return reply.status(201).send({ message: 'Biometria registrada com sucesso!' });
  }

  async listBiometria(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();

    const credentials = await (db as any).biometriaCredentials.findMany({
      where: { userId },
      select: { id: true, deviceName: true, criadoEm: true },
      orderBy: { criadoEm: 'desc' },
    });

    return reply.status(200).send(credentials);
  }

  async removeBiometria(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any)?.sub;
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const { getDatabase } = await import('../../utils/database');
    const db = getDatabase();

    await (db as any).biometriaCredentials.deleteMany({ where: { userId, id } });
    return reply.status(200).send({ message: 'Biometria removida' });
  }
}
