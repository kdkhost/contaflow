import { PrismaClient } from '@prisma/client';
import { config } from './config';
import { logger } from './logger';

let prisma: PrismaClient;

export function getDatabase(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: config.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    });
  }
  return prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    const db = getDatabase();
    await db.$connect();
    logger.info('Banco de dados conectado com sucesso');
  } catch (error) {
    logger.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Banco de dados desconectado');
  }
}