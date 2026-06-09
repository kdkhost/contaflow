import { FastifyInstance } from 'fastify';
import { FinanceiroController } from '../controllers/financeiroController';
import { authenticate } from '../middlewares/authenticate';

export async function financeiroRoutes(app: FastifyInstance) {
  const controller = new FinanceiroController();
  const opts = { preHandler: [authenticate] };

  app.get('/pagar', opts, controller.listarContasPagar.bind(controller));
  app.post('/pagar', opts, controller.criarContaPagar.bind(controller));
  app.post('/pagar/:id/pagar', opts, controller.pagarConta.bind(controller));
  app.get('/receber', opts, controller.listarContasReceber.bind(controller));
  app.post('/receber', opts, controller.criarContaReceber.bind(controller));
  app.post('/receber/:id/receber', opts, controller.receberConta.bind(controller));
  app.get('/conciliacao', opts, controller.conciliacaoBancaria.bind(controller));
  app.put('/pagar/:id', opts, controller.atualizarContaPagar.bind(controller));
  app.delete('/pagar/:id', opts, controller.excluirContaPagar.bind(controller));
  app.put('/receber/:id', opts, controller.atualizarContaReceber.bind(controller));
  app.delete('/receber/:id', opts, controller.excluirContaReceber.bind(controller));
  app.get('/fluxo-caixa', opts, controller.fluxoCaixa.bind(controller));
}