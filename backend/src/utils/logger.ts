import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from './config';

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (stack) log += `\n${stack}`;
  if (Object.keys(meta).length > 0) log += ` ${JSON.stringify(meta)}`;
  return log;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat,
    ),
  }),
  new DailyRotateFile({
    filename: `${config.LOG_DIR}/contaflow-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      json(),
    ),
  }),
  new DailyRotateFile({
    filename: `${config.LOG_DIR}/contaflow-error-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '90d',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      json(),
    ),
  }),
];

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports,
});

export const childLogger = (context: string) => logger.child({ context });