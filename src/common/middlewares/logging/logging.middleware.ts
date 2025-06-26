import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const id = `${req.method} ${req.originalUrl}`;

    console.time(id);
    res.on('finish', () => {
      console.timeEnd(id);
    });

    next();
  }
}
