import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character } from './entities/characters.entity';
import { VisitedRegion } from './entities/visited-region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, VisitedRegion])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
