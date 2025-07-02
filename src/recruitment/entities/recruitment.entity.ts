import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RecruitType {
  LEGENDARY = 'legendary',
  RARE = 'rare',
  EPIC = 'epic',
  COMMON = 'common',
}

type RecruitmentPayload = {
  captainId: number;
  recruitId: number;
};

@Entity()
export class Recruitment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  recruitment_date: Date;

  @Column({
    type: 'enum',
    enum: RecruitType,
    default: RecruitType.COMMON,
    comment: 'Type of recruitment, e.g., legendary, rare, epic, common',
  })
  type: RecruitType;

  @Column('json')
  payload: RecruitmentPayload;
}
