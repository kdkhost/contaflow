import 'dotenv/config';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3333', 10),
  HOST: process.env.HOST || '0.0.0.0',

  // Banco de dados
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/contaflow',
  DATABASE_URL_SQLITE: process.env.DATABASE_URL_SQLITE || './data/contaflow.db',
  DATABASE_ADAPTER: process.env.DATABASE_ADAPTER || 'sqlite',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'contaflow-jwt-secret-dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'contaflow-refresh-secret-dev',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'contaflow@sistema.com.br',

  // Graficos
  GRAPHIFY_ENABLED: process.env.GRAPHIFY_ENABLED === 'true',

  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || './logs',

  // Backup
  BACKUP_DIR: process.env.BACKUP_DIR || './backups',
  BACKUP_CRON: process.env.BACKUP_CRON || '0 2 * * *',
  BACKUP_CRIPTOGRAFAR: process.env.BACKUP_CRIPTOGRAFAR === 'true',

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
} as const;