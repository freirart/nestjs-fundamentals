import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception/http-exception.filter';
import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import guardsConfig, { validationSchema } from './guards/guards.config';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import { WrapResponseInterceptor } from './interceptors/wrap-response/wrap-response.interceptor';
import { LoggingMiddleware } from './middlewares/logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      validationSchema,
      load: [guardsConfig],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
