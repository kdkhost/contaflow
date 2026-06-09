import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/authenticate';

export async function dashboardRoutes(app: FastifyInstance) {
  const controller = new DashboardController();
  const opts = { preHandler: [authenticate] };

  app.get('/resumo', opts, controller.resumo.bind(controller));
  app.get('/calendario-fiscal', opts, controller.calendarioFiscal.bind(controller));
  app.get('/notificacoes', opts, controller.notificacoes.bind(controller));
  app.get('/indicadores', opts, controller.indicadores.bind(controller));
}