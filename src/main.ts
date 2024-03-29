import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { APP_CONFIG } from './commons/constants';
import { IAppConfig } from './config/app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // get app config
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>(APP_CONFIG);

  // setup api global prefix
  const globalPrefix = appConfig.APP_PREFIX;
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe());

  const appPort = process.env.APP_PORT || appConfig.APP_PORT || 3001;

  await app.listen(appPort);
}
bootstrap();
