import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecruitDto } from './dto/recruit.dto';
import { RecruitmentService } from './recruitment.service';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Get()
  findAll() {
    return this.recruitmentService.findAll();
  }

  @Post()
  recruit(@Body() recruitDto: RecruitDto) {
    return this.recruitmentService.recruit(recruitDto);
  }
}
