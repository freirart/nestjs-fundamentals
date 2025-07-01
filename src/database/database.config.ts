import * as Joi from '@hapi/joi';
import { registerAs } from '@nestjs/config';

export const validationSchema = Joi.object({
  DB_TYPE: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.required(),
  DB_PASSWORD: Joi.required(),
  DB_DATABASE: Joi.required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
});

export default registerAs('database', () => ({
  type: process.env.DB_TYPE as 'aurora-mysql',
  host: process.env.DB_HOST,
  port: parseInt(`${process.env.DB_PORT}`, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
}));
