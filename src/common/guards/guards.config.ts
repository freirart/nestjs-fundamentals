import * as Joi from '@hapi/joi';
import { registerAs } from '@nestjs/config';

export const validationSchema = Joi.object({
  API_KEY: Joi.required(),
});

export default registerAs('guard', () => ({
  apiKey: process.env.API_KEY,
}));
