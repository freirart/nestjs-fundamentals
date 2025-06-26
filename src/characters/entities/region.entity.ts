import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Character } from './characters.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((_type) => Character, (character) => character.visitedRegions)
  visitors: Character[];
}
