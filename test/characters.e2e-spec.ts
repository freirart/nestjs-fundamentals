import { HttpStatus, type INestApplication } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { omit } from 'lodash';
import type { CreateCharacterDto } from 'src/characters/dto/create-character.dto';
import { UpdateCharacterDto } from 'src/characters/dto/update-character.dto';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import type { Repository } from 'typeorm';
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
      const characters = await charactersRepository.save([
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
      ]);

      const { status, body } = await makeGetRequest();

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        data: expect.arrayContaining(characters),
      });
    });

    describe('ao passar o parâmetro id', () => {
      describe('e for um id válido', () => {
        it('deve retornar o personagem com este id e suas regiões visitadas', async () => {
          const visitedRegions = await saveRegions('Korinthia', 'Lakonia');
          const character = await charactersRepository.save({
            name: 'Kassandra',
            nickname: 'The Eagle Bearer',
            visitedRegions,
          });

          const { status, body } = await makeGetRequest(character.id);

          expect(status).toBe(HttpStatus.OK);
          expect(body).toEqual({ data: expect.objectContaining(character) });
        });
      });

      describe('caso contrário', () => {
        it('se for um id inexistente, deve retornar o erro HTTP 404 Not Found', async () => {
          const { status, body } = await makeGetRequest(-1);

          expect(status).toBe(HttpStatus.NOT_FOUND);
          expect(body).toMatchObject({
            message: 'Unable to find character with id: -1',
          });
        });

        it('se for um id num formato inválido, deve retornar o erro HTTP 400 Bad Request', async () => {
          const { status, body } = await makeGetRequest('invalid-id');

          expect(status).toBe(HttpStatus.BAD_REQUEST);
          expect(body).toMatchObject({ message: 'NaN is not a valid integer' });
        });
      });
    });
  });

  describe('POST /characters', () => {
    const makePostRequest = (data: CreateCharacterDto) => {
      return request(app.getHttpServer())
        .post('/characters')
        .set('Authorization', `Bearer ${apiKey}`)
        .send(data);
    };

    it('deve conseguir criar um personagem', async () => {
      const { status, body } = await makePostRequest({
        name: 'Kassandra',
        nickname: 'The Eagle Bearer',
        visitedRegions: [],
      });

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        data: expect.objectContaining({
          id: expect.any(Number),
          name: 'Kassandra',
          nickname: 'The Eagle Bearer',
          visitedRegions: [],
        }),
      });
    });

    describe('ao informar as regiões visitadas de um personagem', () => {
      describe('e as regiões não existirem', () => {
        it('deve conseguir criar um personagem e as suas regiões visitadas', async () => {
          expect(regionRepository.count()).resolves.toBe(0);

          const visitedRegions = ['Korinthia', 'Lakonia'];
          const { status, body } = await makePostRequest({
            name: 'Kassandra',
            nickname: 'The Eagle Bearer',
            visitedRegions,
          });

          expect(status).toBe(HttpStatus.CREATED);
          expect(body).toMatchObject({
            data: expect.objectContaining({
              id: expect.any(Number),
              name: 'Kassandra',
              nickname: 'The Eagle Bearer',
              visitedRegions: visitedRegions.map((name) =>
                expect.objectContaining({ name, id: expect.any(Number) }),
              ),
            }),
          });

          expect(regionRepository.count()).resolves.toBe(visitedRegions.length);
          expect(regionRepository.find()).resolves.toEqual(
            expect.arrayContaining(
              visitedRegions.map((name) =>
                expect.objectContaining({ id: expect.any(Number), name }),
              ),
            ),
          );
        });
      });

      describe('e as regiões já existirem', () => {
        it('deve conseguir criar um personagem e associar as regiões visitadas existentes', async () => {
          const visitedRegions = await saveRegions('Korinthia', 'Lakonia');
          expect(regionRepository.count()).resolves.toBe(visitedRegions.length);

          const { status, body } = await makePostRequest({
            name: 'Kassandra',
            nickname: 'The Eagle Bearer',
            visitedRegions: visitedRegions.map((region) => region.name),
          });

          expect(status).toBe(HttpStatus.CREATED);
          expect(body).toMatchObject({
            data: expect.objectContaining({
              id: expect.any(Number),
              name: 'Kassandra',
              nickname: 'The Eagle Bearer',
              visitedRegions,
            }),
          });

          expect(regionRepository.find()).resolves.toEqual(
            expect.arrayContaining(
              visitedRegions.map((region) =>
                expect.objectContaining({
                  id: expect.any(Number),
                  name: region.name,
                }),
              ),
            ),
          );
        });
      });
    });
  });

  describe('PATCH /characters/:id', () => {
    const makePatchRequest = (
      id: number | string,
      data: UpdateCharacterDto,
    ) => {
      return request(app.getHttpServer())
        .patch(`/characters/${id}`)
        .set('Authorization', `Bearer ${apiKey}`)
        .send(data);
    };

    describe('ao informar um id válido', () => {
      it('deve conseguir atualizar um personagem', async () => {
        const character = await charactersRepository.save({
          name: 'Kassandra',
          nickname: 'The Eagle Bearer',
        });

        const { status, body } = await makePatchRequest(character.id, {
          name: 'Alexios',
        });

        expect(status).toBe(HttpStatus.OK);
        expect(body).toMatchObject({
          data: expect.objectContaining({
            id: character.id,
            name: 'Alexios',
            nickname: 'The Eagle Bearer',
          }),
        });
      });

      describe('e informar as regiões visitadas de um personagem', () => {
        describe('caso as regiões não existam', () => {
          it('deve conseguir atualizar um personagem e criar as suas regiões visitadas', async () => {
            const character = await charactersRepository.save({
              name: 'Kassandra',
              nickname: 'The Eagle Bearer',
              visitedRegions: [],
            });

            expect(regionRepository.count()).resolves.toBe(0);

            const visitedRegions = ['Korinthia', 'Lakonia'];
            const { status, body } = await makePatchRequest(character.id, {
              name: 'Alexios',
              nickname: 'The Eagle Bearer',
              visitedRegions,
            });

            expect(status).toBe(HttpStatus.OK);
            expect(body).toMatchObject({
              data: expect.objectContaining({
                id: character.id,
                name: 'Alexios',
                nickname: 'The Eagle Bearer',
                visitedRegions: visitedRegions.map((name) =>
                  expect.objectContaining({ name, id: expect.any(Number) }),
                ),
              }),
            });

            expect(regionRepository.count()).resolves.toBe(
              visitedRegions.length,
            );
            expect(regionRepository.find()).resolves.toEqual(
              expect.arrayContaining(
                visitedRegions.map((name) =>
                  expect.objectContaining({ id: expect.any(Number), name }),
                ),
              ),
            );
          });
        });

        describe('caso as regiões já existam', () => {
          it('deve conseguir atualizar um personagem e associar as regiões visitadas existentes', async () => {
            const visitedRegions = await saveRegions('Korinthia', 'Lakonia');
            expect(regionRepository.count()).resolves.toBe(
              visitedRegions.length,
            );

            const character = await charactersRepository.save({
              name: 'Kassandra',
              nickname: 'The Eagle Bearer',
              visitedRegions: [],
            });

            const { status, body } = await makePatchRequest(character.id, {
              name: 'Alexios',
              nickname: 'The Eagle Bearer',
              visitedRegions: visitedRegions.map((region) => region.name),
            });

            expect(status).toBe(HttpStatus.OK);
            expect(body).toMatchObject({
              data: expect.objectContaining({
                id: character.id,
                name: 'Alexios',
                nickname: 'The Eagle Bearer',
                visitedRegions,
              }),
            });

            expect(regionRepository.find()).resolves.toEqual(
              expect.arrayContaining(
                visitedRegions.map((region) =>
                  expect.objectContaining({
                    id: expect.any(Number),
                    name: region.name,
                  }),
                ),
              ),
            );
          });
        });
      });
    });

    describe('ao informar um id inválido', () => {
      it('deve retornar o erro HTTP 404 Not Found se o id não existir', async () => {
        const { status, body } = await makePatchRequest(-1, {
          name: 'Alexios',
        });

        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(body).toMatchObject({
          message: 'Unable to update character with id: -1',
        });
      });

      it('deve retornar o erro HTTP 400 Bad Request se o id for inválido', async () => {
        const { status, body } = await makePatchRequest('invalid-id', {
          name: 'Alexios',
        });

        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(body).toMatchObject({ message: 'NaN is not a valid integer' });
      });
    });
  });

  describe('DELETE /characters/:id', () => {
    const makeDeleteRequest = (id: number | string) => {
      return request(app.getHttpServer())
        .delete(`/characters/${id}`)
        .set('Authorization', `Bearer ${apiKey}`);
    };

    describe('ao informar um id válido', () => {
      it('deve conseguir remover um personagem', async () => {
        const character = await charactersRepository.save({
          name: 'Kassandra',
          nickname: 'The Eagle Bearer',
          visitedRegions: [],
        });

        const { status, body } = await makeDeleteRequest(character.id);

        expect(status).toBe(HttpStatus.OK);
        expect(body).toEqual({
          data: expect.objectContaining(omit(character, 'id')),
        });

        expect(
          charactersRepository.findOneBy({ id: character.id }),
        ).resolves.toBeNull();
      });
    });

    describe('ao informar um id inválido', () => {
      it('deve retornar o erro HTTP 404 Not Found se o id não existir', async () => {
        const { status, body } = await makeDeleteRequest(-1);

        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(body).toMatchObject({
          message: 'Unable to find character with id: -1',
        });
      });

      it('deve retornar o erro HTTP 400 Bad Request se o id for inválido', async () => {
        const { status, body } = await makeDeleteRequest('invalid-id');

        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(body).toMatchObject({ message: 'NaN is not a valid integer' });
      });
    });
  });
});
