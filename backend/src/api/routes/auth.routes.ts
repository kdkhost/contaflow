import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middlewares/authenticate';

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  app.post('/login', controller.login.bind(controller));
  app.post('/register', controller.register.bind(controller));
  app.post('/refresh-token', controller.refreshToken.bind(controller));
  app.post('/login-supervisionado', controller.loginSupervisionado.bind(controller));
  app.get('/usuarios', { preHandler: [authenticate] }, controller.listarUsuarios.bind(controller));
  app.post('/logout', { preHandler: [authenticate] }, controller.logout.bind(controller));
  app.post('/change-password', { preHandler: [authenticate] }, controller.changePassword.bind(controller));
  app.get('/me', { preHandler: [authenticate] }, controller.me.bind(controller));
}
