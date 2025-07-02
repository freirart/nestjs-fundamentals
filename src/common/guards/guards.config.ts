import * as Joi from '@hapi/joi';
import { registerAs } from '@nestjs/config';

export const validationSchema = Joi.object({
  API_BEARER_TOKEN: Joi.required(),
});

export default registerAs('guard', () => ({
  apiBearerToken: process.env.API_BEARER_TOKEN,
}));
