import {
  CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { type Observable } from 'rxjs';
import guardsConfig from '../guards.config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(guardsConfig.KEY)
    private configService: ConfigType<typeof guardsConfig>,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    const desiredHeader = `Bearer ${this.configService.apiKey}`;

    return authHeader === desiredHeader;
  }
}
