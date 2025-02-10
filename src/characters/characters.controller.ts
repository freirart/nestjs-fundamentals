import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    return this.charactersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.charactersService.remove(id);
  }
}
