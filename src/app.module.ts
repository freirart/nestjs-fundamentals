import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharactersController } from './characters/characters.controller';
import { CharactersService } from './characters/characters.service';

@Module({
  imports: [],
  controllers: [AppController, CharactersController],
  providers: [AppService, CharactersService],
})
export class AppModule {}
