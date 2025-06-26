import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

export const Protocol = createParamDecorator(
  (shouldUpperCase: boolean, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const protocol = request.protocol;

    return shouldUpperCase ? protocol.toUpperCase() : protocol;
  },
);
