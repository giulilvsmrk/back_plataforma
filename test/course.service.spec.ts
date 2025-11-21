import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { CourseService } from '../src/course/course.service';
import { CourseEntity } from '../src/course/entity/course.entity';
import { UserEntity } from '../src/user/entity/user.entity';
import { CourseDto } from '../src/course/dto/course.dto';
import { UpdateCourseDto } from '../src/course/dto/update-course.dto';

describe('CourseService', () => {
  let service: CourseService;

  const mockCourseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = new UserEntity();
  mockUser.uuid_user = 'creator-uuid';

  const mockCourse = new CourseEntity();
  mockCourse.uuid_course = 'course-uuid';
  mockCourse.title = 'Test Course';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(CourseEntity),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const courseDto: CourseDto = {
        title: 'New Course',
        description: 'A new course',
      };
      mockCourseRepository.create.mockReturnValue(mockCourse);
      mockCourseRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(courseDto, mockUser);
      expect(result).toEqual(mockCourse);
      expect(mockCourseRepository.create).toHaveBeenCalledWith({
        ...courseDto,
        creator: mockUser,
      });
      expect(mockCourseRepository.save).toHaveBeenCalledWith(mockCourse);
    });
  });

  describe('findOne', () => {
    it('should find a course by uuid', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      const result = await service.findOne('course-uuid');
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateDto: UpdateCourseDto = { title: 'Updated Title' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCourse);
      mockCourseRepository.save.mockResolvedValue({
        ...mockCourse,
        ...updateDto,
      });

      const result = await service.update('course-uuid', updateDto);
      expect(mockCourseRepository.merge).toHaveBeenCalledWith(
        mockCourse,
        updateDto,
      );
      expect(result.title).toEqual('Updated Title');
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockCourseRepository.delete.mockResolvedValue({ affected: 1 });
      const result = await service.remove('course-uuid');
      expect(result).toEqual({
        message: `Curso con UUID course-uuid ha sido eliminado correctamente.`,
      });
    });

    it('should throw NotFoundException if course to remove is not found', async () => {
      mockCourseRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('non-existent-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
