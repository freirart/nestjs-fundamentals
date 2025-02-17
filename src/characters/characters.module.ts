import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruitment } from '../recruitment/entities/recruitment.entity';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { Character } from './entities/characters.entity';
import { VisitedRegion } from './entities/visited-region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, VisitedRegion, Recruitment])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
