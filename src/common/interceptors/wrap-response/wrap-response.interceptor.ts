import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Código que pode ser executado antes da execução da próxima função
    // ...
    return next.handle().pipe(
      map((data: unknown) => {
        // Manipulação da resposta
        return { data };
      }),
    );
  }
}
