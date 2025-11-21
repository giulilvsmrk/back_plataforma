import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TopicService } from './topic.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';

@Controller('topic')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicService.createTopic(createTopicDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  findAll() {
    return this.topicService.findAll();
  }

  @Get('course/:course_uuid')
  findAllByCourse(@Param('course_uuid', ParseUUIDPipe) course_uuid: string) {
    return this.topicService.findAllByCourse(course_uuid);
  }

  @Get(':uuid')
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.topicService.findOne(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicService.update(uuid, updateTopicDto);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.topicService.remove(uuid);
  }
}
