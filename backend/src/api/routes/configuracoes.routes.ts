import { FastifyInstance } from 'fastify';
import { ConfiguracoesController } from '../controllers/configuracoesController';
import { authenticate } from '../middlewares/authenticate';

const controller = new ConfiguracoesController();

export async function configuracoesRoutes(app: FastifyInstance) {
  const opts = { preHandler: [authenticate] };

  app.get('/configuracoes', opts, controller.getConfiguracoes.bind(controller));
  app.put('/configuracoes', opts, controller.updateConfiguracoes.bind(controller));
  app.post('/configuracoes/smtp/test', opts, controller.testSmtp.bind(controller));
  app.post('/configuracoes/2fa/setup', opts, controller.setupTwoFactor.bind(controller));
  app.post('/configuracoes/2fa/confirm', opts, controller.confirmTwoFactor.bind(controller));
  app.post('/configuracoes/2fa/verify', controller.verifyTwoFactor.bind(controller));
  app.delete('/configuracoes/2fa', opts, controller.disableTwoFactor.bind(controller));
  app.post('/configuracoes/biometria', opts, controller.setupBiometria.bind(controller));
  app.get('/configuracoes/biometria', opts, controller.listBiometria.bind(controller));
  app.delete('/configuracoes/biometria/:id', opts, controller.removeBiometria.bind(controller));
}
