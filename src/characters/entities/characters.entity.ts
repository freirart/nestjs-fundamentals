import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitedRegion } from './visited-region.entity';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column({ default: 0 })
  shipCrewHeadCount: number;

  @JoinTable()
  @ManyToMany((_type) => VisitedRegion, (region) => region.visitors, {
    cascade: true,
  })
  visitedRegions: VisitedRegion[];
}
