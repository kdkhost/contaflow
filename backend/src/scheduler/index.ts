import cron from 'node-cron';
import { logger } from '../utils/logger';
import { certidoesQueue, integracoesQueue, backupQueue } from '../workers';

export function setupScheduler() {
  // Certidoes conjuntas - todos os dias as 6h
  cron.schedule('0 6 * * *', async () => {
    logger.info('Iniciando consulta de certidoes conjuntas');
    await certidoesQueue.add('certidoes-conjuntas', {
      tipo: 'CERTIDAO_CONJUNTA',
      data: new Date().toISOString(),
    });
  });

  // EFD ICMS/IPI - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo EFD ICMS/IPI');
  });

  // EFD PIS/COFINS - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo EFD PIS/COFINS');
  });

  // SPED ECD - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo SPED ECD');
  });

  // SPED ECF - ultimo dia util do mes
  cron.schedule('0 8 28-31 * *', async () => {
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const ultimoDia = new Date(proximoMes.getTime() - 86400000);
    if (hoje.getDate() === ultimoDia.getDate()) {
      logger.info('Lembrete: Prazo SPED ECF');
    }
  });

  // DCTFWeb - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo DCTFWeb');
  });

  // eSocial S-1299 - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo eSocial S-1299 Fechamento');
  });

  // EFD-Reinf - dia 15 de cada mes
  cron.schedule('0 8 15 * *', async () => {
    logger.info('Lembrete: Prazo EFD-Reinf');
  });

  // Simples Nacional DAS - dia 20 de cada mes
  cron.schedule('0 8 20 * *', async () => {
    logger.info('Lembrete: Prazo DAS Simples Nacional');
  });

  // Backup diario - 2h da manha
  cron.schedule('0 2 * * *', async () => {
    logger.info('Iniciando backup automatico');
    await backupQueue.add('backup-diario', {
      tipo: 'COMPLETO',
      data: new Date().toISOString(),
    });
  });

  // Integracao com portais - a cada 6 horas
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Verificando integracoes com portais');
    await integracoesQueue.add('verificar-integracoes', {
      data: new Date().toISOString(),
    });
  });

  // Limpeza de sessoes expiradas - todo dia a meia noite
  cron.schedule('0 0 * * *', async () => {
    logger.info('Limpando sessoes expiradas');
  });

  logger.info('Scheduler configurado com sucesso');
}