import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TopicEntity } from './entity/topic.entity';
import { CourseEntity } from '../course/entity/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopicEntity, CourseEntity])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
