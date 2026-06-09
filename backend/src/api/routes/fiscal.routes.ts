import { FastifyInstance } from 'fastify';
import { FiscalController } from '../controllers/fiscalController';
import { authenticate } from '../middlewares/authenticate';

export async function fiscalRoutes(app: FastifyInstance) {
  const controller = new FiscalController();
  const opts = { preHandler: [authenticate] };

  app.get('/icms/apurar', opts, controller.apurarICMS.bind(controller));
  app.get('/pis-cofins/apurar', opts, controller.apurarPISCOFINS.bind(controller));
  app.get('/notas-fiscais', opts, controller.listarNotasFiscais.bind(controller));
  app.post('/notas-fiscais/xml', opts, controller.processarXML.bind(controller));
  app.get('/efd/gerar', opts, controller.gerarEFD.bind(controller));
  app.get('/sped/gerar', opts, controller.gerarSPED.bind(controller));
  app.get('/obrigacoes', opts, controller.listarObrigacoes.bind(controller));
  app.post('/obrigacoes', opts, controller.criarObrigacao.bind(controller));
  app.put('/obrigacoes/:id', opts, controller.atualizarObrigacao.bind(controller));
  app.delete('/obrigacoes/:id', opts, controller.excluirObrigacao.bind(controller));
  app.put('/notas-fiscais/:id', opts, controller.atualizarNotaFiscal.bind(controller));
  app.delete('/notas-fiscais/:id', opts, controller.excluirNotaFiscal.bind(controller));
}