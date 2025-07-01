import { INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { Character } from '../src/characters/entities/characters.entity';
import { Region } from '../src/characters/entities/region.entity';
import guardsConfig from '../src/common/guards/guards.config';
import { appFactory } from './fixtures';

describe('CRUD /characters', () => {
  let app: INestApplication<App>;
  let charactersRepository: Repository<Character>;
  let regionRepository: Repository<Region>;
  let apiKey: string | undefined;

  beforeAll(async () => {
    app = await appFactory();

    charactersRepository = app.get(getRepositoryToken(Character));
    regionRepository = app.get(getRepositoryToken(Region));

    apiKey = app.get<ConfigType<typeof guardsConfig>>(guardsConfig.KEY).apiKey;
  });

  afterEach(async () => {
    await charactersRepository.delete({});
    await regionRepository.delete({});
  });

  afterAll(() => {
    return app.close();
  });

  const saveRegions = (...regions: string[]) => {
    return Promise.all(
      regions.map((region) =>
        regionRepository.save(regionRepository.create({ name: region })),
      ),
    );
  };

  describe('GET /characters', () => {
    const makeGetRequest = (param: string | number = '') => {
      return request(app.getHttpServer())
        .get(`/characters/${param}`)
        .set('Authorization', `Bearer ${apiKey}`);
    };

    it('deve retornar todos os personagens e as regiões que visitou quando o parâmetro id não for informado', async () => {
      const visitedRegions1 = await saveRegions('Korinthia', 'Lakonia');
      const visitedRegions2 = await saveRegions(
        'Makedonia',
        'Argolis',
        'Megaris',
      );
      const characters = await charactersRepository.save(
        charactersRepository.create([
          {
            name: 'Kassandra',
            nickname: 'The Eagle Bearer',
            visitedRegions: visitedRegions1,
          },
          {
            name: 'Nikolaos',
            nickname: 'Wolf of Sparta',
            visitedRegions: visitedRegions2,
          },
        ]),
      );

      const { status, body } = await makeGetRequest();

      expect(status).toBe(200);
      expect(body).toEqual({
        data: expect.arrayContaining(characters),
      });
    });

    describe('ao passar o parâmetro id', () => {
      describe('e for um id válido', () => {
        it('deve retornar o personagem com este id e suas regiões visitadas', async () => {
          const visitedRegions = await saveRegions('Korinthia', 'Lakonia');
          const character = await charactersRepository.save(
            charactersRepository.create({
              name: 'Kassandra',
              nickname: 'The Eagle Bearer',
              visitedRegions,
            }),
          );

          const { status, body } = await makeGetRequest(character.id);

          expect(status).toBe(200);
          expect(body).toEqual({ data: expect.objectContaining(character) });
        });
      });

      describe('caso contrário', () => {
        it('se for um id inexistente, deve retornar 404', async () => {
          const { status, body } = await makeGetRequest(-1);

          expect(status).toBe(404);
          expect(body).toMatchObject({
            message: 'Unable to find character with id: -1',
          });
        });

        it('se for um id num formato inválido, deve retornar 400', async () => {
          const { status, body } = await makeGetRequest('invalid-id');

          expect(status).toBe(400);
          expect(body).toMatchObject({ message: 'NaN is not a valid integer' });
        });
      });
    });
  });
});
