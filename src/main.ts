import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/env/app.config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get<ConfigService>(ConfigService);

  SwaggerModule.setup('/docs', app, createSwaggerDocument(app, configService));

  const { port } = configService.get<IAppConfig>('app');

  app.use(helmet());
  await app.listen(port);
}
bootstrap();
