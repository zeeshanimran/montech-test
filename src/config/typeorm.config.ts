import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const DEFAULTS = {
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING as LoggerOptions,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

export const typeOrmPostgresConfig: TypeOrmModuleOptions = {
  ...DEFAULTS,
  type: 'postgres',
  host: process.env.DB_POSTGRES_HOST || process.env.DB_HOST,
  port: parseInt(process.env.DB_POSTGRES_PORT, 10) || 5432,
  username: process.env.DB_POSTGRES_USERNAME,
  password: process.env.DB_POSTGRES_PASSWORD,
  database: process.env.DB_POSTGRES_DATABASE,
  entities: [__dirname + '/../**/entities/*.entity.{js,ts}'],
};
