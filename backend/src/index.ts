import 'dotenv/config';
import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastifyZod } from 'fastify-type-provider-zod';

import { logger } from './utils/logger';
import { config } from './utils/config';
import { connectDatabase, disconnectDatabase } from './utils/database';
import { errorHandler } from './api/middlewares/errorHandler';
import { tenantMiddleware } from './api/middlewares/tenantMiddleware';
import { auditMiddleware } from './api/middlewares/auditMiddleware';
import { authMiddleware } from './api/middlewares/authMiddleware';
import { authRoutes } from './api/routes/auth.routes';
import { contabilRoutes } from './api/routes/contabil.routes';
import { fiscalRoutes } from './api/routes/fiscal.routes';
import { pessoalRoutes } from './api/routes/pessoal.routes';
import { financeiroRoutes } from './api/routes/financeiro.routes';
import { graphifyRoutes } from './api/routes/graphify.routes';
import { integracoesRoutes } from './api/routes/integracoes.routes';
import { dashboardRoutes } from './api/routes/dashboard.routes';
import { kanbanRoutes } from './api/routes/kanban.routes';
import { setupWorkers } from './workers';
import { setupScheduler } from './scheduler';

async function bootstrap() {
  const app = Fastify({
    logger: {
      level: config.LOG_LEVEL,
      transport: config.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  });

  // Plugins
  await app.register(cors, {
    origin: config.CORS_ORIGIN.split(','),
    credentials: config.CORS_CREDENTIALS === 'true',
  });

  await app.register(jwt, {
    secret: config.JWT_SECRET,
    sign: { expiresIn: config.JWT_EXPIRES_IN },
  });

  await app.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW,
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'ContaFlow API',
        description: 'Sistema Contabil Completo',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${config.PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(fastifySwaggerUi, { routePrefix: '/docs' });

  // Middlewares globais
  await app.register(tenantMiddleware);
  await app.register(authMiddleware);
  await app.register(auditMiddleware);

  // Tratamento global de erros
  app.setErrorHandler(errorHandler);

  // Rotas (registradas no root scope para herdar decorate do authMiddleware)
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(contabilRoutes, { prefix: '/api/contabil' });
  app.register(fiscalRoutes, { prefix: '/api/fiscal' });
  app.register(pessoalRoutes, { prefix: '/api/pessoal' });
  app.register(financeiroRoutes, { prefix: '/api/financeiro' });
  app.register(graphifyRoutes, { prefix: '/api/graphify' });
  app.register(integracoesRoutes, { prefix: '/api/integracoes' });
  app.register(dashboardRoutes, { prefix: '/api/dashboard' });
  app.register(kanbanRoutes, { prefix: '/api' });

  // Iniciar workers e scheduler
  setupWorkers();
  setupScheduler();

  // Conectar ao banco de dados
  try {
    await connectDatabase();
  } catch (error) {
    logger.error('Falha ao conectar ao banco de dados:', error);
  }

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // Root
  app.get('/', async () => ({
    name: 'ContaFlow API',
    version: '1.0.0',
    status: 'running',
    docs: '/docs',
  }));

  // Iniciar servidor
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    logger.info(`ContaFlow API rodando na porta ${config.PORT}`);
    logger.info(`Documentacao disponivel em http://localhost:${config.PORT}/docs`);
  } catch (err) {
    logger.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} recebido. Encerrando servidor...`);
    await disconnectDatabase();
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();