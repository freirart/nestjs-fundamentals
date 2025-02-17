import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruitment } from 'src/recruitment/entities/recruitment.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/characters.entity';
import { VisitedRegion } from './entities/visited-region.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(VisitedRegion)
    private readonly visitedRegionRepository: Repository<VisitedRegion>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit: take, offset: skip } = paginationQuery;

    return this.characterRepository.find({
      relations: {
        visitedRegions: true,
      },
      take,
      skip,
    });
  }

  async findOne(id: number): Promise<Character> | never {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: {
        visitedRegions: true,
      },
    });

    if (character) {
      return character;
    }

    throw new NotFoundException(`Unable to find character with id: ${id}`);
  }

  async create(createCharacterDto: CreateCharacterDto) {
    const visitedRegions = await Promise.all(
      createCharacterDto.visitedRegions.map((name) =>
        this.preloadVisitedRegionByName(name),
      ),
    );

    const newCharacter = this.characterRepository.create({
      ...createCharacterDto,
      visitedRegions,
    });

    return this.characterRepository.save(newCharacter);
  }

  async update(
    id: number,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> | never {
    const visitedRegions =
      updateCharacterDto.visitedRegions &&
      (await Promise.all(
        updateCharacterDto.visitedRegions.map((name) =>
          this.preloadVisitedRegionByName(name),
        ),
      ));

    const existingCharacter = await this.characterRepository.preload({
      id,
      ...updateCharacterDto,
      visitedRegions,
    });

    if (existingCharacter) {
      return this.characterRepository.save(existingCharacter);
    }

    throw new NotFoundException(`Unable to update character with id: ${id}`);
  }

  async remove(id: number): Promise<Character> | never {
    const existingCharacter = await this.findOne(id);
    return this.characterRepository.remove(existingCharacter);
  }

  private async preloadVisitedRegionByName(
    name: string,
  ): Promise<VisitedRegion> {
    const existingVisitedRegion = await this.visitedRegionRepository.findOne({
      where: { name },
    });

    if (existingVisitedRegion) {
      return existingVisitedRegion;
    }

    return this.visitedRegionRepository.create({ name });
  }

  async recruit(captain: Character) {
    await this.dataSource.transaction(async (manager) => {
      captain.shipCrewHeadCount++;

      const recruitment = new Recruitment();
      recruitment.name = `Fulano #${captain.shipCrewHeadCount}`;
      recruitment.type = 'Legendary';
      recruitment.payload = { captainId: captain.id };

      await manager.save(recruitment);
      await manager.save(captain);
    });
  }
}
