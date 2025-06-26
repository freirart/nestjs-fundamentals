import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

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
}
