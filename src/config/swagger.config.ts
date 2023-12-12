import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ISwaggerConfig } from './env/swagger.config';

export function createSwaggerDocument(
  app: INestApplication,
  configService: ConfigService,
): OpenAPIObject {
  const { apiName, description, version } =
    configService.get<ISwaggerConfig>('swagger');

  const config = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth({
      type: 'http',
      description: 'token JWT',
      bearerFormat: 'JWT',
      scheme: 'bearer',
    });

  return SwaggerModule.createDocument(app, config.build());
}
