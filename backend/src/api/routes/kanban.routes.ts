import { FastifyInstance } from 'fastify';
import { getDatabase } from '../../utils/database';

interface KanbanTarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  dataVencimento: string | null;
  responsavel: string | null;
  empresaId: string;
  createdAt: string;
  updatedAt: string;
}

export async function kanbanRoutes(app: FastifyInstance) {
  // Listar tarefas
  app.get('/kanban/tarefas', async (request, reply) => {
    try {
      const db = getDatabase();
      const empresaId = (request as any).user?.empresaId;

      const tarefas = await db.kanbanTarefa.findMany({
        where: empresaId ? { empresaId } : {},
        orderBy: { criadoEm: 'desc' },
      });

      return reply.send({ tarefas });
    } catch (error: any) {
      console.error('KANBAN ERROR:', error?.message, error?.stack);
      return reply.status(500).send({ error: 'Erro ao buscar tarefas', detail: error?.message });
    }
  });

  // Criar tarefa
  app.post('/kanban/tarefas', async (request, reply) => {
    try {
      const db = getDatabase();
      const empresaId = (request as any).user?.empresaId;
      const { titulo, descricao, status, prioridade, dataVencimento, responsavel } = request.body as any;

      if (!titulo) {
        return reply.status(400).send({ error: 'Titulo e obrigatorio' });
      }

      const tarefa = await db.kanbanTarefa.create({
        data: {
          titulo,
          descricao: descricao || '',
          status: status || 'PENDENTE',
          prioridade: prioridade || 'medium',
          dataVencimento: dataVencimento || null,
          responsavel: responsavel || null,
          empresaId: empresaId || 'default',
        },
      });

      return reply.status(201).send({ tarefa });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar tarefa' });
    }
  });

  // Atualizar tarefa
  app.put('/kanban/tarefas/:id', async (request, reply) => {
    try {
      const db = getDatabase();
      const { id } = request.params as { id: string };
      const data = request.body as any;

      const tarefa = await db.kanbanTarefa.update({
        where: { id },
        data: {
          ...(data.titulo !== undefined && { titulo: data.titulo }),
          ...(data.descricao !== undefined && { descricao: data.descricao }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
          ...(data.dataVencimento !== undefined && { dataVencimento: data.dataVencimento }),
          ...(data.responsavel !== undefined && { responsavel: data.responsavel }),
        },
      });

      return reply.send({ tarefa });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao atualizar tarefa' });
    }
  });

  // Excluir tarefa
  app.delete('/kanban/tarefas/:id', async (request, reply) => {
    try {
      const db = getDatabase();
      const { id } = request.params as { id: string };

      await db.kanbanTarefa.delete({
        where: { id },
      });

      return reply.send({ success: true });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao excluir tarefa' });
    }
  });

  // Mover tarefa (atualizar status)
  app.patch('/kanban/tarefas/:id/mover', async (request, reply) => {
    try {
      const db = getDatabase();
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };

      const tarefa = await db.kanbanTarefa.update({
        where: { id },
        data: { status },
      });

      return reply.send({ tarefa });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao mover tarefa' });
    }
  });
}
