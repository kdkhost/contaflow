import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';
import { AppError } from '../middlewares/errorHandler';

export class PessoalController {
  async listarFuncionarios(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const funcionarios = await db.funcionarios.findMany({
      where: { empresaId: request.user!.empresaId },
      orderBy: { nome: 'asc' },
    });
    return reply.send(funcionarios);
  }

  async criarFuncionario(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const existente = await db.funcionarios.findFirst({
      where: { cpf: body.cpf as string },
    });
    if (existente) throw new AppError('CPF ja cadastrado', 409, 'CPF_EXISTS');

    const funcionario = await db.funcionarios.create({
      data: {
        ...body,
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
      } as never,
    });

    return reply.status(201).send(funcionario);
  }

  async obterFuncionario(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();
    const funcionario = await db.funcionarios.findFirst({
      where: { id, empresaId: request.user!.empresaId },
      include: { dependentes: true },
    });
    if (!funcionario) throw new AppError('Funcionario nao encontrado', 404);
    return reply.send(funcionario);
  }

  async atualizarFuncionario(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as Record<string, unknown>;
    const db = getDatabase();

    const funcionario = await db.funcionarios.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!funcionario) throw new AppError('Funcionario nao encontrado', 404);

    const atualizado = await db.funcionarios.update({
      where: { id },
      data: body as never,
    });

    return reply.send(atualizado);
  }

  async excluirFuncionario(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const funcionario = await db.funcionarios.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!funcionario) throw new AppError('Funcionario nao encontrado', 404);

    await db.funcionarios.delete({ where: { id } });
    return reply.status(204).send();
  }

  async calcularFolha(request: FastifyRequest, reply: FastifyReply) {
    const { competencia } = request.query as { competencia: string };
    const db = getDatabase();

    const funcionarios = await db.funcionarios.findMany({
      where: { empresaId: request.user!.empresaId, situacao: 'ATIVO' },
    });

    const folha = funcionarios.map((func) => {
      const salario = Number(func.salario);
      const inss = salario * 0.075;
      const fgts = salario * 0.08;
      const descontos = inss + (salario * 0.05);
      return {
        funcionarioId: func.id,
        nome: func.nome,
        salarioBase: salario,
        inss,
        fgts,
        irrf: 0,
        descontos,
        valorLiquido: salario - descontos,
      };
    });

    const totalBruto = folha.reduce((acc, f) => acc + f.salarioBase, 0);
    const totalDescontos = folha.reduce((acc, f) => acc + f.descontos, 0);
    const totalLiquido = folha.reduce((acc, f) => acc + f.valorLiquido, 0);

    return reply.send({
      competencia,
      funcionarios: folha,
      totalBruto,
      totalDescontos,
      totalLiquido,
      totalFuncionarios: funcionarios.length,
    });
  }

  async enviarEventoEsocial(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { tipo: string; funcionarioId: string; competencia: string };
    const db = getDatabase();

    const evento = await db.eventosEsocial.create({
      data: {
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
        tipo: body.tipo as 'S_1200',
        codigo: body.tipo,
        descricao: `Evento ${body.tipo}`,
        competencia: body.competencia,
        dataEvento: new Date(),
        funcionarioId: body.funcionarioId,
      },
    });

    return reply.status(201).send(evento);
  }

  async listarEventosEsocial(request: FastifyRequest, reply: FastifyReply) {
    const { status, competencia } = request.query as Record<string, string>;
    const db = getDatabase();

    const where: Record<string, unknown> = { empresaId: request.user!.empresaId };
    if (status) where.status = status;
    if (competencia) where.competencia = competencia;

    const eventos = await db.eventosEsocial.findMany({
      where,
      include: { funcionario: true },
      orderBy: { criadoEm: 'desc' },
    });

    return reply.send(eventos);
  }

  async calcularFerias(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { funcionarioId: string; dataInicio: string; dataFim: string; dias: number };
    const db = getDatabase();

    const funcionario = await db.funcionarios.findFirst({
      where: { id: body.funcionarioId },
    });
    if (!funcionario) throw new AppError('Funcionario nao encontrado', 404);

    const salarioDiario = Number(funcionario.salario) / 30;
    const valorFerias = salarioDiario * body.dias;
    const valorUmTerco = valorFerias / 3;

    return reply.send({
      funcionarioId: body.funcionarioId,
      nome: funcionario.nome,
      dias: body.dias,
      valorFerias,
      valorUmTerco,
      valorLiquido: valorFerias + valorUmTerco,
    });
  }

  async excluirEventoEsocial(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const db = getDatabase();

    const evento = await db.eventosEsocial.findFirst({
      where: { id, empresaId: request.user!.empresaId },
    });
    if (!evento) throw new AppError('Evento nao encontrado', 404);

    await db.eventosEsocial.delete({ where: { id } });
    return reply.status(204).send();
  }

  async calcularRescisao(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { funcionarioId: string; tipoRescisao: string };
    const db = getDatabase();

    const funcionario = await db.funcionarios.findFirst({
      where: { id: body.funcionarioId },
    });
    if (!funcionario) throw new AppError('Funcionario nao encontrado', 404);

    const saldoSalario = Number(funcionario.salario) * 0.5;
    const decimoTerceiro = Number(funcionario.salario) / 12 * 6;
    const avisoPrevio = Number(funcionario.salario);

    return reply.send({
      funcionarioId: body.funcionarioId,
      nome: funcionario.nome,
      tipoRescisao: body.tipoRescisao,
      saldoSalario,
      decimoTerceiro,
      avisoPrevio,
      fgts: Number(funcionario.salario) * 0.08,
      multaFgts: Number(funcionario.salario) * 0.08 * 0.4,
      valorTotal: saldoSalario + decimoTerceiro + avisoPrevio,
    });
  }
}