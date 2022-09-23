import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { APP_CONFIG } from './commons/constants';
import { IAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // get app config
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>(APP_CONFIG);

  // setup api global prefix
  const globalPrefix = appConfig.APP_PREFIX;
  app.setGlobalPrefix(globalPrefix);

  const appPort = process.env.PORT || appConfig.APP_PORT;

  await app.listen(appPort);
}
bootstrap();
