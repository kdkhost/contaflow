import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { contabilRoutes } from './contabil.routes';
import { fiscalRoutes } from './fiscal.routes';
import { pessoalRoutes } from './pessoal.routes';
import { financeiroRoutes } from './financeiro.routes';
import { graphifyRoutes } from './graphify.routes';
import { integracoesRoutes } from './integracoes.routes';
import { dashboardRoutes } from './dashboard.routes';
import { kanbanRoutes } from './kanban.routes';
import { configuracoesRoutes } from './configuracoes.routes';

export async function setupRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(contabilRoutes, { prefix: '/api/contabil' });
  app.register(fiscalRoutes, { prefix: '/api/fiscal' });
  app.register(pessoalRoutes, { prefix: '/api/pessoal' });
  app.register(financeiroRoutes, { prefix: '/api/financeiro' });
  app.register(graphifyRoutes, { prefix: '/api/graphify' });
  app.register(integracoesRoutes, { prefix: '/api/integracoes' });
  app.register(dashboardRoutes, { prefix: '/api/dashboard' });
  app.register(kanbanRoutes, { prefix: '/api' });
  app.register(configuracoesRoutes, { prefix: '/api' });
}