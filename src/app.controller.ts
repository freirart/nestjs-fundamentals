import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiRequestTimeoutResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Protocol } from './common/decorators/protocol.decorator';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @ApiRequestTimeoutResponse({
    description: 'This endpoint throws a timeout error by default.',
  })
  @Public()
  @Get()
  async getHello(): Promise<string> {
    await new Promise((resolve) =>
      setTimeout(
        resolve,
        +this.configService.getOrThrow<number>('API_TIMEOUT') + 500,
      ),
    );
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth(@Protocol() protocol: string): string {
    console.log('Requisição recebida via:', protocol);
    return 'OK';
  }
}
