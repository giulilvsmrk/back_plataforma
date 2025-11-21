import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from 'src/topic/entity/topic.entity';

import { LessonEntity } from './entity/lesson.entity';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, TopicEntity])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
