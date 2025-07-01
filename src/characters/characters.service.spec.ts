import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createMockRepository, MockRepository } from '../../test/fixtures';
import { CharactersService } from './characters.service';
import { Character } from './entities/characters.entity';
import { Region } from './entities/region.entity';

describe('CharactersService', () => {
  let service: CharactersService;
  let charactersRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Region),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Character),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    charactersRepository = module.get<MockRepository>(
      getRepositoryToken(Character),
    );
  });

  describe('findOne', () => {
    describe('when characters with ID exists', () => {
      it('should return the characters object', () => {
        const charactersId = 1;
        const expectedCharacters = {};

        charactersRepository.findOne?.mockReturnValue(expectedCharacters);
        return expect(service.findOne(charactersId)).resolves.toEqual(
          expectedCharacters,
        );
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', () => {
        const charactersId = 1;
        charactersRepository.findOne?.mockReturnValue(undefined);

        expect.assertions(2);

        return service.findOne(charactersId).catch((err: Error) => {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Unable to find character with id: ${charactersId}`,
          );
        });
      });
    });
  });
});
