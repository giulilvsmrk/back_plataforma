import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseEntity } from './entity/course.entity';
import { UserEntity } from '../user/entity/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, UserEntity]), AuthModule],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
