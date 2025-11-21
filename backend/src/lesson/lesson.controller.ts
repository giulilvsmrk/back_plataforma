import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { LessonService } from './lesson.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.createLesson(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get('topic/:topic_uuid')
  findAllByTopic(@Param('topic_uuid', ParseUUIDPipe) topic_uuid: string) {
    return this.lessonService.findAllByTopic(topic_uuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.lessonService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.update(uuid, updateLessonDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.lessonService.remove(uuid);
  }
}
