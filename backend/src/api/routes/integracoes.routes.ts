import { FastifyInstance } from 'fastify';
import { IntegracoesController } from '../controllers/integracoesController';
import { authenticate } from '../middlewares/authenticate';

export async function integracoesRoutes(app: FastifyInstance) {
  const controller = new IntegracoesController();
  const opts = { preHandler: [authenticate] };

  app.get('/', opts, controller.listarIntegracoes.bind(controller));
  app.post('/', opts, controller.criarIntegracao.bind(controller));
  app.post('/:id/executar', opts, controller.executarIntegracao.bind(controller));
  app.get('/certidoes-conjuntas', opts, controller.certidoesConjuntas.bind(controller));
  app.get('/cnd', opts, controller.consultarCND.bind(controller));
  app.delete('/:id', opts, controller.excluirIntegracao.bind(controller));
}