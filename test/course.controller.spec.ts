import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';

import { CourseController } from '../src/course/course.controller';
import { CourseService } from '../src/course/course.service';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { UserEntity } from '../src/user/entity/user.entity';
import { CourseDto } from '../src/course/dto/course.dto';
import { UpdateCourseDto } from '../src/course/dto/update-course.dto';

const MOCK_USER: UserEntity = {
  uuid_user: 'user-uuid-1',
  email: 'test@example.com',
  name: 'Test',
  lastname: 'User',
  password: 'hashedpassword',
  isConfirmed: true,
  confirmationToken: null,
  user_role: [],
};

const MOCK_COURSE = {
  uuid_course: 'course-uuid-1',
  title: 'Test Course',
  description: 'Test Description',
  creator: MOCK_USER,
};

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourseService = {
    create: jest.fn().mockResolvedValue(MOCK_COURSE),
    findAll: jest.fn().mockResolvedValue([MOCK_COURSE]),
    findOne: jest.fn().mockResolvedValue(MOCK_COURSE),
    update: jest
      .fn()
      .mockResolvedValue({ ...MOCK_COURSE, title: 'Updated Course' }),
    remove: jest.fn().mockResolvedValue({
      message: 'Curso con UUID course-uuid-1 ha sido eliminado correctamente.',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const courseDto: CourseDto = {
        title: 'Test Course',
        description: 'Test Description',
      };
      const req = { user: MOCK_USER };

      const result = await controller.create(courseDto, req);

      expect(result).toEqual(MOCK_COURSE);
      expect(service.create).toHaveBeenCalledWith(courseDto, MOCK_USER);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([MOCK_COURSE]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      const uuid = 'course-uuid-1';
      const result = await controller.findOne(uuid);
      expect(result).toEqual(MOCK_COURSE);
      expect(service.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const uuid = 'course-uuid-1';
      const updateCourseDto: UpdateCourseDto = { title: 'Updated Course' };

      const result = await controller.update(uuid, updateCourseDto);

      expect(result.title).toEqual('Updated Course');
      expect(service.update).toHaveBeenCalledWith(uuid, updateCourseDto);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      const uuid = 'course-uuid-1';
      const result = await controller.remove(uuid);

      expect(result).toEqual({
        message: `Curso con UUID ${uuid} ha sido eliminado correctamente.`,
      });
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
