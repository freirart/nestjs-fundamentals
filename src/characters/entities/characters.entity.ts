import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Region } from './region.entity';

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
  @ManyToMany((_type) => Region, (region) => region.visitors, {
    cascade: true,
  })
  visitedRegions: Region[];
}
