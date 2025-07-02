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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ParseIntPipe } from '../common/pipes/parse-int/parse-int.pipe';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/characters.entity';

@ApiBearerAuth()
@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.charactersService.findAll(paginationQuery);
  }

  @ApiBadRequestResponse({
    description: 'Invalid character ID',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @ApiCreatedResponse({
    description: 'Character created successfully',
    type: Character,
  })
  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }

  @ApiBadRequestResponse({
    description: 'Invalid character ID',
  })
  @ApiOkResponse({
    description: 'Character updated successfully',
    type: Character,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @ApiOkResponse({
    description: 'Character deleted successfully',
    type: Character,
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}
