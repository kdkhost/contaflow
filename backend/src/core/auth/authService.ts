import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { getDatabase } from '../../utils/database';
import { config } from '../../utils/config';
import { AppError } from '../../api/middlewares/errorHandler';
import { JWTPayload } from '../../api/middlewares/authMiddleware';
import { registrarAuditoria } from '../../api/middlewares/auditMiddleware';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LoginInput {
  email: string;
  senha: string;
  tenantId: string;
  ipAddress?: string;
  userAgent?: string;
}

interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
  empresaId: string;
  tenantId: string;
  role?: string;
}

export class AuthService {
  private db = getDatabase();

  async login(input: LoginInput): Promise<TokenPair & { usuario: unknown }> {
    const usuario = await this.db.usuarios.findFirst({
      where: { email: input.email, tenantId: input.tenantId },
      include: { empresa: true },
    });

    if (!usuario) {
      throw new AppError('Credenciais invalidas', 401, 'INVALID_CREDENTIALS');
    }

    if (usuario.status !== 'ATIVO') {
      throw new AppError('Conta bloqueada ou inativa', 403, 'ACCOUNT_DISABLED');
    }

    if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      throw new AppError('Conta temporariamente bloqueada', 423, 'ACCOUNT_LOCKED');
    }

    const senhaValida = await compare(input.senha, usuario.senha);
    if (!senhaValida) {
      const tentativas = usuario.tentativasLogin + 1;
      const updates: Record<string, unknown> = { tentativasLogin: tentativas };

      if (tentativas >= 5) {
        updates.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000);
      }

      await this.db.usuarios.update({
        where: { id: usuario.id },
        data: updates,
      });

      throw new AppError('Credenciais invalidas', 401, 'INVALID_CREDENTIALS');
    }

    if (usuario.tentativasLogin > 0) {
      await this.db.usuarios.update({
        where: { id: usuario.id },
        data: { tentativasLogin: 0, bloqueadoAte: null },
      });
    }

    await this.db.usuarios.update({
      where: { id: usuario.id },
      data: { ultimoAcesso: new Date() },
    });

    const tokens = await this.generateTokens(usuario);
    await this.saveSession(usuario.id, tokens.refreshToken, usuario.tenantId, input.ipAddress, input.userAgent);

    await registrarAuditoria({
      empresaId: usuario.empresaId,
      tenantId: usuario.tenantId,
      usuarioId: usuario.id,
      acao: 'LOGIN',
      entidade: 'usuarios',
      entidadeId: usuario.id,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    return {
      ...tokens,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        empresa: usuario.empresa,
      },
    };
  }

  async register(input: RegisterInput) {
    const existingUser = await this.db.usuarios.findFirst({
      where: { email: input.email, tenantId: input.tenantId },
    });

    if (existingUser) {
      throw new AppError('Email ja cadastrado', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await hash(input.senha, 12);

    const usuario = await this.db.usuarios.create({
      data: {
        nome: input.nome,
        email: input.email,
        senha: hashedPassword,
        empresaId: input.empresaId,
        tenantId: input.tenantId,
        role: (input.role as 'AUXILIAR') || 'AUXILIAR',
      },
    });

    await registrarAuditoria({
      empresaId: input.empresaId,
      tenantId: input.tenantId,
      usuarioId: usuario.id,
      acao: 'REGISTER',
      entidade: 'usuarios',
      entidadeId: usuario.id,
      dadosNovos: { nome: usuario.nome, email: usuario.email, role: usuario.role },
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async refreshToken(token: string): Promise<TokenPair> {
    try {
      const decoded = verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;

      const sessao = await this.db.sessoes.findFirst({
        where: { token, expiraEm: { gt: new Date() } },
      });

      if (!sessao) {
        throw new AppError('Refresh token invalido', 401, 'INVALID_REFRESH_TOKEN');
      }

      const usuario = await this.db.usuarios.findUnique({
        where: { id: decoded.sub },
      });

      if (!usuario || usuario.status !== 'ATIVO') {
        throw new AppError('Usuario nao encontrado ou inativo', 401, 'USER_NOT_FOUND');
      }

      await this.db.sessoes.delete({ where: { id: sessao.id } });

      const tokens = await this.generateTokens(usuario);
      await this.saveSession(usuario.id, tokens.refreshToken, usuario.tenantId);

      return tokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Refresh token invalido', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  async logout(usuarioId: string, token?: string): Promise<void> {
    if (token) {
      await this.db.sessoes.deleteMany({ where: { token } });
    } else {
      await this.db.sessoes.deleteMany({ where: { usuarioId } });
    }
  }

  async changePassword(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void> {
    const usuario = await this.db.usuarios.findUnique({ where: { id: usuarioId } });
    if (!usuario) throw new AppError('Usuario nao encontrado', 404, 'USER_NOT_FOUND');

    const senhaValida = await compare(senhaAtual, usuario.senha);
    if (!senhaValida) throw new AppError('Senha atual incorreta', 401, 'INVALID_PASSWORD');

    const hashedPassword = await hash(novaSenha, 12);
    await this.db.usuarios.update({
      where: { id: usuarioId },
      data: { senha: hashedPassword },
    });
  }

  private async generateTokens(usuario: { id: string; email: string; role: string; empresaId: string; tenantId: string }): Promise<TokenPair> {
    const payload: JWTPayload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
      empresaId: usuario.empresaId,
      tenantId: usuario.tenantId,
    };

    const accessToken = sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });

    const refreshToken = sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  private async saveSession(
    usuarioId: string,
    token: string,
    tenantId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 7);

    await this.db.sessoes.create({
      data: {
        id: uuid(),
        usuarioId,
        token,
        tenantId,
        ipAddress,
        userAgent,
        expiraEm,
      },
    });
  }
}