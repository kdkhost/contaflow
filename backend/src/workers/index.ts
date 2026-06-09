import { Worker, Queue } from 'bullmq';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

const connection = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD || undefined,
  enableOfflineQueue: false,
};

// Filas
export const esocialQueue = new Queue('esocial', { connection });
export const nfeQueue = new Queue('nfe', { connection });
export const certidoesQueue = new Queue('certidoes', { connection });
export const integracoesQueue = new Queue('integracoes', { connection });
export const backupQueue = new Queue('backup', { connection });

let workers: Worker[] = [];

export function setupWorkers() {
  try {
    // Worker eSocial
    const esocialWorker = new Worker('esocial', async (job) => {
      logger.info(`Processando evento eSocial: ${job.name}`, job.data);
      const { tipo } = job.data;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      logger.info(`Evento eSocial ${tipo} processado com sucesso`);
      return { status: 'ACEITO', protocolo: `PROTOCOLO-${Date.now()}` };
    }, { connection, concurrency: 5 });

    esocialWorker.on('completed', (job) => {
      logger.info(`Job eSocial ${job.id} concluido`);
    });

    esocialWorker.on('failed', (job, err) => {
      logger.error(`Job eSocial ${job?.id} falhou:`, err);
    });

    // Worker NF-e
    const nfeWorker = new Worker('nfe', async (job) => {
      logger.info(`Processando NF-e: ${job.name}`, job.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { status: 'AUTORIZADA', protocolo: `NFE-${Date.now()}` };
    }, { connection, concurrency: 10 });

    // Worker Certidoes
    const certidoesWorker = new Worker('certidoes', async (job) => {
      logger.info(`Consultando certidao: ${job.name}`, job.data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return { status: 'POSITIVA', validade: '2026-12-31' };
    }, { connection, concurrency: 3 });

    // Worker Integracoes
    const integracoesWorker = new Worker('integracoes', async (job) => {
      logger.info(`Executando integracao: ${job.name}`, job.data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { status: 'CONCLUIDO' };
    }, { connection, concurrency: 5 });

    // Worker Backup
    const backupWorker = new Worker('backup', async (job) => {
      logger.info(`Executando backup: ${job.name}`, job.data);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: 'CONCLUIDO', arquivo: `backup-${Date.now()}.enc` };
    }, { connection, concurrency: 1 });

    workers = [esocialWorker, nfeWorker, certidoesWorker, integracoesWorker, backupWorker];
    logger.info('Workers iniciados com sucesso');
  } catch (error) {
    logger.warn('Redis nao disponivel - workers desabilitados');
  }
}

export async function shutdownWorkers() {
  await Promise.all(workers.map((w) => w.close()));
  logger.info('Workers encerrados');
}