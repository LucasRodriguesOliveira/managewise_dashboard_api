import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PORT: Joi.number().required(),
  API_NAME: Joi.string().required(),
  API_VERSION: Joi.string()
    .optional()
    .default('v1.0')
    .regex(/v\d\.\d+\.\d+/),
  API_DESCRIPTION: Joi.string().optional().default(''),
  DB_PORT: Joi.number().required().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().required().default(6379),
});
