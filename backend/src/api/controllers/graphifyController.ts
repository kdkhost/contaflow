import { FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../utils/database';

export class GraphifyController {
  async mapeamentoContabil(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const contas = await db.contasContabeis.findMany({
      where: { empresaId: request.user!.empresaId },
      orderBy: { codigo: 'asc' },
    });

    const nodes = contas.map((conta, index) => ({
      id: conta.id,
      type: 'contaContabil',
      position: { x: (index % 5) * 250, y: Math.floor(index / 5) * 150 },
      data: {
        label: `${conta.codigo} - ${conta.descricao}`,
        tipo: conta.tipo,
        nivel: conta.nivel,
        aceitaLancamento: conta.aceitaLancamento,
      },
    }));

    const edges = contas
      .filter((c) => c.contaPaiId)
      .map((conta) => ({
        id: `e-${conta.contaPaiId}-${conta.id}`,
        source: conta.contaPaiId!,
        target: conta.id,
        type: 'smoothstep',
      }));

    return reply.send({ nodes, edges, tipo: 'PLANO_CONTAS' });
  }

  async mapeamentoFiscal(request: FastifyRequest, reply: FastifyReply) {
    const fluxo = {
      nodes: [
        { id: 'nfe', type: 'processo', position: { x: 50, y: 50 }, data: { label: 'NF-e/NFC-e' } },
        { id: 'icms', type: 'processo', position: { x: 300, y: 50 }, data: { label: 'ICMS' } },
        { id: 'pis', type: 'processo', position: { x: 50, y: 200 }, data: { label: 'PIS' } },
        { id: 'cofins', type: 'processo', position: { x: 300, y: 200 }, data: { label: 'COFINS' } },
        { id: 'irpj', type: 'processo', position: { x: 50, y: 350 }, data: { label: 'IRPJ' } },
        { id: 'csll', type: 'processo', position: { x: 300, y: 350 }, data: { label: 'CSLL' } },
        { id: 'efd_icms', type: 'obrigacao', position: { x: 550, y: 50 }, data: { label: 'EFD ICMS/IPI' } },
        { id: 'efd_pis', type: 'obrigacao', position: { x: 550, y: 200 }, data: { label: 'EFD PIS/COFINS' } },
        { id: 'dctfweb', type: 'obrigacao', position: { x: 550, y: 350 }, data: { label: 'DCTFWeb' } },
      ],
      edges: [
        { id: 'e1', source: 'nfe', target: 'icms', label: 'Apuracao' },
        { id: 'e2', source: 'nfe', target: 'pis', label: 'Apuracao' },
        { id: 'e3', source: 'nfe', target: 'cofins', label: 'Apuracao' },
        { id: 'e4', source: 'icms', target: 'efd_icms', label: 'Envio' },
        { id: 'e5', source: 'pis', target: 'efd_pis', label: 'Envio' },
        { id: 'e6', source: 'cofins', target: 'efd_pis', label: 'Envio' },
        { id: 'e7', source: 'irpj', target: 'dctfweb', label: 'Envio' },
        { id: 'e8', source: 'csll', target: 'dctfweb', label: 'Envio' },
      ],
    };

    return reply.send({ ...fluxo, tipo: 'FLUXO_FISCAL' });
  }

  async mapeamentoTrabalhista(request: FastifyRequest, reply: FastifyReply) {
    const fluxo = {
      nodes: [
        { id: 'cadastro', type: 'processo', position: { x: 50, y: 100 }, data: { label: 'Cadastro Funcionario' } },
        { id: 's2200', type: 'evento', position: { x: 300, y: 50 }, data: { label: 'S-2200 Admissao' } },
        { id: 's1200', type: 'evento', position: { x: 300, y: 150 }, data: { label: 'S-1200 Remuneracao' } },
        { id: 's1299', type: 'evento', position: { x: 300, y: 250 }, data: { label: 'S-1299 Fechamento' } },
        { id: 'folha', type: 'processo', position: { x: 550, y: 100 }, data: { label: 'Folha de Pagamento' } },
        { id: 'esocial', type: 'sistema', position: { x: 550, y: 250 }, data: { label: 'eSocial' } },
        { id: 'resposta', type: 'resposta', position: { x: 800, y: 150 }, data: { label: 'Resposta eSocial' } },
      ],
      edges: [
        { id: 'e1', source: 'cadastro', target: 's2200', label: 'Gerar' },
        { id: 'e2', source: 'folha', target: 's1200', label: 'Gerar' },
        { id: 'e3', source: 's1200', target: 's1299', label: 'Apos Calculo' },
        { id: 'e4', source: 's2200', target: 'esocial', label: 'Enviar' },
        { id: 'e5', source: 's1200', target: 'esocial', label: 'Enviar' },
        { id: 'e6', source: 's1299', target: 'esocial', label: 'Enviar' },
        { id: 'e7', source: 'esocial', target: 'resposta', label: 'Retorno' },
      ],
    };

    return reply.send({ ...fluxo, tipo: 'FLUXO_TRABALHISTA' });
  }

  async integracoes(request: FastifyRequest, reply: FastifyReply) {
    const fluxo = {
      nodes: [
        { id: 'contaflow', type: 'sistema', position: { x: 400, y: 200 }, data: { label: 'ContaFlow' } },
        { id: 'sped', type: 'portal', position: { x: 100, y: 50 }, data: { label: 'SPED' } },
        { id: 'esocial_portal', type: 'portal', position: { x: 100, y: 150 }, data: { label: 'eSocial' } },
        { id: 'nfe_portal', type: 'portal', position: { x: 100, y: 250 }, data: { label: 'NF-e' } },
        { id: 'dctfweb_portal', type: 'portal', position: { x: 100, y: 350 }, data: { label: 'DCTFWeb' } },
        { id: 'reinf', type: 'portal', position: { x: 700, y: 50 }, data: { label: 'EFD-Reinf' } },
        { id: 'simples', type: 'portal', position: { x: 700, y: 150 }, data: { label: 'Simples Nacional' } },
        { id: 'ecac', type: 'portal', position: { x: 700, y: 250 }, data: { label: 'e-CAC' } },
        { id: 'certidoes', type: 'portal', position: { x: 700, y: 350 }, data: { label: 'Certidoes' } },
      ],
      edges: [
        { id: 'e1', source: 'contaflow', target: 'sped', label: 'ECD/ECF/EFD', animated: true },
        { id: 'e2', source: 'contaflow', target: 'esocial_portal', label: 'Eventos', animated: true },
        { id: 'e3', source: 'contaflow', target: 'nfe_portal', label: 'XMLs', animated: true },
        { id: 'e4', source: 'contaflow', target: 'dctfweb_portal', label: 'Guias', animated: true },
        { id: 'e5', source: 'contaflow', target: 'reinf', label: 'Retencoes' },
        { id: 'e6', source: 'contaflow', target: 'simples', label: 'DAS' },
        { id: 'e7', source: 'contaflow', target: 'ecac', label: 'Obrigacoes' },
        { id: 'e8', source: 'contaflow', target: 'certidoes', label: 'Consultas' },
      ],
    };

    return reply.send({ ...fluxo, tipo: 'INTEGRACOES' });
  }

  async salvarMapa(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { tipo: string; titulo: string; dados: unknown; descricao?: string };
    const db = getDatabase();

    const mapa = await db.graphifyMapas.create({
      data: {
        empresaId: request.user!.empresaId,
        tenantId: request.user!.tenantId,
        tipo: body.tipo,
        titulo: body.titulo,
        descricao: body.descricao,
        dados: body.dados as Record<string, unknown>,
      },
    });

    return reply.status(201).send(mapa);
  }

  async listarMapas(request: FastifyRequest, reply: FastifyReply) {
    const db = getDatabase();
    const mapas = await db.graphifyMapas.findMany({
      where: { empresaId: request.user!.empresaId },
      orderBy: { atualizadoEm: 'desc' },
    });
    return reply.send(mapas);
  }
}