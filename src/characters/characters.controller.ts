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

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    return this.charactersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() body) {
    return this.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.charactersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.charactersService.remove(id);
  }
}
