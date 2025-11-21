import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CourseService } from './course.service';
import { CourseDto } from './dto/course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';
import { UserEntity } from '../user/entity/user.entity';

@Controller('course')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  create(@Body() courseDto: CourseDto, @Req() req: { user: UserEntity }) {
    return this.courseService.create(courseDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':uuid')
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.courseService.findOne(uuid);
  }

  @Patch(':uuid')
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(uuid, updateCourseDto);
  }

  @Delete(':uuid')
  @Roles(Role.ADMIN, Role.PROFESOR_CREADOR)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.courseService.remove(uuid);
  }
}
