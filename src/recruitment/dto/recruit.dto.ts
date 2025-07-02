import { IsEnum, IsPositive } from 'class-validator';
import { RecruitType } from '../entities/recruitment.entity';

export class RecruitDto {
  @IsPositive()
  captainId: number;

  @IsPositive()
  recruitId: number;

  @IsEnum(RecruitType)
  type: RecruitType;
}
