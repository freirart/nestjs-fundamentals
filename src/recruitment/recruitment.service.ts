import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CharactersService } from '../characters/characters.service';
import { RecruitDto } from './dto/recruit.dto';
import { Recruitment } from './entities/recruitment.entity';

@Injectable()
export class RecruitmentService {
  constructor(
    private readonly characterService: CharactersService,
    @InjectRepository(Recruitment)
    private readonly recruitmentRepository: Repository<Recruitment>,
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.recruitmentRepository.find();
  }

  async recruit(recruitDto: RecruitDto) {
    const { captainId, recruitId, type } = recruitDto;

    const captain = await this.characterService.findOne(captainId);
    const recruit = await this.characterService.findOne(recruitId);

    return await this.dataSource.transaction(async (manager) => {
      captain.shipCrewHeadCount++;

      const recruitment = this.recruitmentRepository.create({
        type,
        payload: {
          captainId: captain.id,
          recruitId: recruit.id,
        },
      });

      await manager.save(recruitment);
      await manager.save(captain);

      return recruitment;
    });
  }
}
