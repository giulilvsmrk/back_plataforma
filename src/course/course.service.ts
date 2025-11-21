import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseEntity } from './entity/course.entity';
import { CourseDto } from './dto/course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async create(
    courseDto: CourseDto,
    creator: UserEntity,
  ): Promise<CourseEntity> {
    const course = this.courseRepository.create({
      ...courseDto,
      creator,
    });
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<CourseEntity[]> {
    return this.courseRepository.find({ relations: ['creator'] });
  }

  async findOne(uuid_course: string): Promise<CourseEntity> {
    const course = await this.courseRepository.findOne({
      where: { uuid_course },
      relations: ['creator'],
    });
    if (!course) {
      throw new NotFoundException(
        `Curso con UUID ${uuid_course} no encontrado.`,
      );
    }
    return course;
  }

  async update(
    uuid_course: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseEntity> {
    const course = await this.findOne(uuid_course);
    this.courseRepository.merge(course, updateCourseDto);
    return this.courseRepository.save(course);
  }

  async remove(uuid_course: string): Promise<{ message: string }> {
    const result = await this.courseRepository.delete(uuid_course);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Curso con UUID ${uuid_course} no encontrado.`,
      );
    }
    return {
      message: `Curso con UUID ${uuid_course} ha sido eliminado correctamente.`,
    };
  }
}
