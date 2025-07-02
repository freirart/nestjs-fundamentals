import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { Character } from '../src/characters/entities/characters.entity';
import guardsConfig from '../src/common/guards/guards.config';
import { RecruitDto } from '../src/recruitment/dto/recruit.dto';
import {
  Recruitment,
  RecruitType,
} from '../src/recruitment/entities/recruitment.entity';
import { appFactory } from './fixtures';

describe('Recruitment', () => {
  let app: INestApplication<App>;
  let charactersRepository: Repository<Character>;
  let recruitmentRepository: Repository<Recruitment>;

  let apiBearerToken: string | undefined;

  beforeAll(async () => {
    app = await appFactory();

    charactersRepository = app.get(getRepositoryToken(Character));
    recruitmentRepository = app.get(getRepositoryToken(Recruitment));

    apiBearerToken = app.get<ConfigType<typeof guardsConfig>>(
      guardsConfig.KEY,
    ).apiBearerToken;
  });

  afterEach(async () => {
    await charactersRepository.delete({});
    await recruitmentRepository.delete({});
  });

  afterAll(() => {
    return app.close();
  });

  describe('GET /recruitment', () => {
    const makeGetRequest = () => {
      return request(app.getHttpServer())
        .get('/recruitment')
        .set('Authorization', `Bearer ${apiBearerToken}`);
    };

    it('deve retornar todos os recrutamentos existentes', async () => {
      const captain = await charactersRepository.save({
        name: 'Kassandra',
        nickname: 'The Eagle Bearer',
      });

      const recruit1 = await charactersRepository.save({
        name: 'Herodotos',
        nickname: 'The Historian',
      });
      const recruit2 = await charactersRepository.save({
        name: 'Aspasia',
        nickname: 'The Leader',
      });

      const recruitments = await Promise.all([
        await recruitmentRepository.save({
          type: RecruitType.COMMON,
          payload: {
            captainId: captain.id,
            recruitId: recruit1.id,
          },
        }),
        await recruitmentRepository.save({
          type: RecruitType.RARE,
          payload: {
            captainId: captain.id,
            recruitId: recruit2.id,
          },
        }),
      ]);

      expect(recruitmentRepository.count()).resolves.toBe(recruitments.length);

      const { body, status } = await makeGetRequest();

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual({
        data: expect.arrayContaining(JSON.parse(JSON.stringify(recruitments))),
      });
      expect(body.data).toHaveLength(recruitments.length);
    });
  });

  describe('POST /recruitment', () => {
    const makePostRequest = (payload: RecruitDto) => {
      return request(app.getHttpServer())
        .post('/recruitment')
        .set('Authorization', `Bearer ${apiBearerToken}`)
        .send(payload);
    };

    it('deve conseguir criar recrutamentos', async () => {
      const captain = await charactersRepository.save({
        name: 'Kassandra',
        nickname: 'The Eagle Bearer',
      });
      const recruit = await charactersRepository.save({
        name: 'Herodotos',
        nickname: 'The Historian',
      });

      expect(recruitmentRepository.count()).resolves.toBe(0);

      const { body, status } = await makePostRequest({
        type: RecruitType.COMMON,
        captainId: captain.id,
        recruitId: recruit.id,
      });

      expect(status).toBe(HttpStatus.CREATED);
      expect(body).toEqual({
        data: {
          id: expect.any(Number),
          recruitment_date: expect.any(String),
          type: RecruitType.COMMON,
          payload: {
            captainId: captain.id,
            recruitId: recruit.id,
          },
        },
      });

      expect(recruitmentRepository.count()).resolves.toBe(1);
    });
  });
});
