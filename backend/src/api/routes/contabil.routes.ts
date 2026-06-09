import { FastifyInstance } from 'fastify';
import { ContabilController } from '../controllers/contabilController';
import { authenticate } from '../middlewares/authenticate';

export async function contabilRoutes(app: FastifyInstance) {
  const controller = new ContabilController();
  const opts = { preHandler: [authenticate] };

  app.get('/contas', opts, controller.listarContas.bind(controller));
  app.post('/contas', opts, controller.criarConta.bind(controller));
  app.get('/contas/:id', opts, controller.obterConta.bind(controller));
  app.put('/contas/:id', opts, controller.atualizarConta.bind(controller));
  app.delete('/contas/:id', opts, controller.excluirConta.bind(controller));

  app.post('/lancamentos', opts, controller.criarLancamento.bind(controller));
  app.get('/lancamentos', opts, controller.listarLancamentos.bind(controller));
  app.put('/lancamentos/:id', opts, controller.atualizarLancamento.bind(controller));
  app.delete('/lancamentos/:id', opts, controller.excluirLancamento.bind(controller));

  app.get('/dre', opts, controller.gerarDRE.bind(controller));
  app.get('/balanco', opts, controller.gerarBalanco.bind(controller));
}