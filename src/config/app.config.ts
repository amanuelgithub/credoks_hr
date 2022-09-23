import { registerAs } from '@nestjs/config';
import { APP_CONFIG } from '../commons/constants';

export interface IAppConfig {
  APP_PREFIX: string;
  APP_PORT: string;
}

export const appConfig = registerAs(APP_CONFIG, () => ({
  APP_PREFIX: process.env.APP_PREFIX,
  APP_PORT: process.env.APP_PORT,
}));
