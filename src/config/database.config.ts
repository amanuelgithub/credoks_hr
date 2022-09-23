import { registerAs } from '@nestjs/config';
import { DB_CONFIG } from 'src/commons/constants';
import { DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/src/env/${process.env.NODE_ENV}.env` });

const postgresqlDataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'credoks_hr',
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  entities: ['dist/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: true,
} as DataSourceOptions;

export const DatabaseConfig = registerAs<DataSourceOptions>(DB_CONFIG, () => {
  return postgresqlDataSourceOption;
});
