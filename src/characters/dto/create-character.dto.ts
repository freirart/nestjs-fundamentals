import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({
    description: 'AC Odyssey character first name',
    example: 'Kassandra',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The nickname given to the character',
    example: 'The Eagle Bearer',
  })
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    description: 'Regions visited by the character',
    example: ['Megaris', 'Boetia'],
  })
  @IsString({ each: true })
  readonly visitedRegions: string[];
}
