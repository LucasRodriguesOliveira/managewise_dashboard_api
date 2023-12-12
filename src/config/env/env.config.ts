import { ConfigModuleOptions } from '@nestjs/config';
import { appConfig } from './app.config';
import { envSchema } from './env.schema';
import { swaggerConfig } from './swagger.config';

export const envConfig: ConfigModuleOptions = {
  load: [appConfig, swaggerConfig],
  validationSchema: envSchema,
};
