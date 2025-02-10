import { Injectable, NotFoundException } from '@nestjs/common';
import { Character } from './entities/characters.entity';

@Injectable()
export class CharactersService {
  private characters: Character[] = [
    {
      id: 1,
      name: 'Kassandra',
      nickname: 'Eagle Bearer',
      visitedRegions: ['Kephallonia', 'Phokis', 'Attika'],
    },
  ];

  findAll(): Character[] {
    return this.characters;
  }

  findOne(id: number): Character | never {
    const character = this.characters.find((character) => character.id === +id);

    if (character) {
      return character;
    }

    throw new NotFoundException(`Unable to find character with id: ${id}`);
  }

  create(createCharacterDto): Character {
    this.characters.push(createCharacterDto);
    return createCharacterDto;
  }

  update(id: number, updateCharacterDto): Character | never {
    const existingCharacter = this.findOne(id);

    if (existingCharacter) {
      const characterIndex = this.characters.indexOf(existingCharacter);
      this.characters[characterIndex] = updateCharacterDto;
      return updateCharacterDto;
    }

    throw new NotFoundException(`Unable to update character with id: ${id}`);
  }

  remove(id: number): Character | never {
    const existingCharacter = this.findOne(id);

    if (existingCharacter) {
      this.characters = this.characters.filter(
        (character) => character.id !== +id,
      );
      return existingCharacter;
    }

    throw new NotFoundException(`Unable to remove character with id: ${id}`);
  }
}
