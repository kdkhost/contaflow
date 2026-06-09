import { FastifyInstance } from 'fastify';
import { GraphifyController } from '../controllers/graphifyController';
import { authenticate } from '../middlewares/authenticate';

export async function graphifyRoutes(app: FastifyInstance) {
  const controller = new GraphifyController();
  const opts = { preHandler: [authenticate] };

  app.get('/mapeamento-contabil', opts, controller.mapeamentoContabil.bind(controller));
  app.get('/mapeamento-fiscal', opts, controller.mapeamentoFiscal.bind(controller));
  app.get('/mapeamento-trabalhista', opts, controller.mapeamentoTrabalhista.bind(controller));
  app.get('/integracoes', opts, controller.integracoes.bind(controller));
  app.post('/mapas', opts, controller.salvarMapa.bind(controller));
  app.get('/mapas', opts, controller.listarMapas.bind(controller));
}