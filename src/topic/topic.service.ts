import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TopicEntity } from './entity/topic.entity';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { CourseEntity } from '../course/entity/course.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async createTopic(createTopicDto: CreateTopicDto): Promise<TopicEntity> {
    const { name, orden, course_uuid } = createTopicDto;

    const course = await this.courseRepository.findOne({
      where: { uuid_course: course_uuid },
    });

    if (!course) {
      throw new NotFoundException(`Curso con ID ${course_uuid} no encontrado`);
    }

    const newTopic = this.topicRepository.create({
      name,
      orden,
      course,
    });

    return this.topicRepository.save(newTopic);
  }

  async findAll(): Promise<TopicEntity[]> {
    return this.topicRepository.find({ relations: ['course'] });
  }

  async findAllByCourse(course_uuid: string): Promise<TopicEntity[]> {
    return this.topicRepository.find({
      where: { course: { uuid_course: course_uuid } },
      relations: ['course'],
      order: { orden: 'ASC' },
    });
  }

  async findOne(uuid_topic: string): Promise<TopicEntity> {
    const topic = await this.topicRepository.findOne({
      where: { uuid_topic },
      relations: ['course', 'lessons'],
    });
    if (!topic) {
      throw new NotFoundException(`Tema con UUID ${uuid_topic} no encontrado.`);
    }
    return topic;
  }

  async update(
    uuid_topic: string,
    updateTopicDto: UpdateTopicDto,
  ): Promise<TopicEntity> {
    const topic = await this.findOne(uuid_topic);
    this.topicRepository.merge(topic, updateTopicDto);
    return this.topicRepository.save(topic);
  }

  async remove(uuid_topic: string): Promise<{ message: string }> {
    const result = await this.topicRepository.delete(uuid_topic);
    if (result.affected === 0) {
      throw new NotFoundException(`Tema con UUID ${uuid_topic} no encontrado.`);
    }
    return { message: `Tema con UUID ${uuid_topic} eliminado correctamente.` };
  }
}
