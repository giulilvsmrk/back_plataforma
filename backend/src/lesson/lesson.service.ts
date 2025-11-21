import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicEntity } from 'src/topic/entity/topic.entity';

import { LessonEntity } from './entity/lesson.entity';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private readonly lessonRepository: Repository<LessonEntity>,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<LessonEntity> {
    const { title, order, description, resource_url, topic_uuid } =
      createLessonDto;

    const topic = await this.topicRepository.findOne({
      where: { uuid_topic: topic_uuid },
    });

    if (!topic) {
      throw new NotFoundException(`Topic con ID ${topic_uuid} no encontrado`);
    }

    const newLesson = this.lessonRepository.create({
      title,
      order,
      description,
      resource_url,
      topic,
    });

    return this.lessonRepository.save(newLesson);
  }

  async findAll(): Promise<LessonEntity[]> {
    return this.lessonRepository.find({ relations: ['topic'] });
  }

  async findAllByTopic(topic_uuid: string): Promise<LessonEntity[]> {
    return this.lessonRepository.find({
      where: { topic: { uuid_topic: topic_uuid } },
      relations: ['topic'],
      order: { order: 'ASC' },
    });
  }

  async findOne(uuid_lesson: string): Promise<LessonEntity> {
    const lesson = await this.lessonRepository.findOne({
      where: { uuid_lesson },
      relations: ['topic'],
    });
    if (!lesson) {
      throw new NotFoundException(
        `Lección con UUID ${uuid_lesson} no encontrada.`,
      );
    }
    return lesson;
  }

  async update(
    uuid_lesson: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonEntity> {
    const lesson = await this.findOne(uuid_lesson);
    this.lessonRepository.merge(lesson, updateLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async remove(uuid_lesson: string): Promise<{ message: string }> {
    const result = await this.lessonRepository.delete(uuid_lesson);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Lección con UUID ${uuid_lesson} no encontrada.`,
      );
    }
    return {
      message: `Lección con UUID ${uuid_lesson} eliminada correctamente.`,
    };
  }
}
