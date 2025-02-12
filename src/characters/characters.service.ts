import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/characters.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  findAll() {
    return this.characterRepository.find();
  }

  async findOne(id: number): Promise<Character> | never {
    const character = await this.characterRepository.findOne({
      where: { id: id },
    });

    if (character) {
      return character;
    }

    throw new NotFoundException(`Unable to find character with id: ${id}`);
  }

  create(createCharacterDto: CreateCharacterDto) {
    const newCharacter = this.characterRepository.create(createCharacterDto);
    return this.characterRepository.save(newCharacter);
  }

  async update(
    id: number,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<Character> | never {
    const existingCharacter = await this.characterRepository.preload({
      id,
      ...updateCharacterDto,
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
}
