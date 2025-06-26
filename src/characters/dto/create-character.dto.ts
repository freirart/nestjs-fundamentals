import { IsString } from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly nickname: string;

  @IsString({ each: true })
  readonly visitedRegions: string[];
}
