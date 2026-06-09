import { FastifyInstance } from 'fastify';
import { PessoalController } from '../controllers/pessoalController';
import { authenticate } from '../middlewares/authenticate';

export async function pessoalRoutes(app: FastifyInstance) {
  const controller = new PessoalController();
  const opts = { preHandler: [authenticate] };

  app.get('/funcionarios', opts, controller.listarFuncionarios.bind(controller));
  app.post('/funcionarios', opts, controller.criarFuncionario.bind(controller));
  app.get('/funcionarios/:id', opts, controller.obterFuncionario.bind(controller));
  app.get('/folha/calcular', opts, controller.calcularFolha.bind(controller));
  app.post('/esocial/evento', opts, controller.enviarEventoEsocial.bind(controller));
  app.get('/esocial/eventos', opts, controller.listarEventosEsocial.bind(controller));
  app.post('/ferias/calcular', opts, controller.calcularFerias.bind(controller));
  app.put('/funcionarios/:id', opts, controller.atualizarFuncionario.bind(controller));
  app.delete('/funcionarios/:id', opts, controller.excluirFuncionario.bind(controller));
  app.post('/rescisao/calcular', opts, controller.calcularRescisao.bind(controller));
  app.delete('/esocial/eventos/:id', opts, controller.excluirEventoEsocial.bind(controller));
}