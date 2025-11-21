import { Test, TestingModule } from '@nestjs/testing';

import { LessonController } from '../src/lesson/lesson.controller';
import { LessonService } from '../src/lesson/lesson.service';
import { CreateLessonDto, UpdateLessonDto } from '../src/lesson/dto/lesson.dto';

const MOCK_TOPIC_UUID = 'topic-uuid-1';
const MOCK_LESSON = {
  uuid_lesson: 'lesson-uuid-1',
  title: 'Test Lesson',
  description: 'Test Description',
  order: 1,
  resource_url: 'http://example.com',
  topic: {
    uuid_topic: MOCK_TOPIC_UUID,
    name: 'Test Topic',
  },
};

describe('LessonController', () => {
  let controller: LessonController;
  let service: LessonService;

  const mockLessonService = {
    createLesson: jest.fn().mockResolvedValue(MOCK_LESSON),
    findAll: jest.fn().mockResolvedValue([MOCK_LESSON]),
    findAllByTopic: jest.fn().mockResolvedValue([MOCK_LESSON]),
    findOne: jest.fn().mockResolvedValue(MOCK_LESSON),
    update: jest
      .fn()
      .mockResolvedValue({ ...MOCK_LESSON, title: 'Updated Lesson' }),
    remove: jest.fn().mockResolvedValue({
      message: `Lección con UUID ${MOCK_LESSON.uuid_lesson} eliminada correctamente.`,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: mockLessonService,
        },
      ],
    }).compile();

    controller = module.get<LessonController>(LessonController);
    service = module.get<LessonService>(LessonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a lesson', async () => {
      const createLessonDto: CreateLessonDto = {
        title: 'Test Lesson',
        description: 'Test Description',
        order: 1,
        resource_url: 'http://example.com',
        topic_uuid: MOCK_TOPIC_UUID,
      };

      const result = await controller.create(createLessonDto);

      expect(result).toEqual(MOCK_LESSON);
      expect(service.createLesson).toHaveBeenCalledWith(createLessonDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of lessons', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([MOCK_LESSON]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByTopic', () => {
    it('should return an array of lessons for a topic', async () => {
      const result = await controller.findAllByTopic(MOCK_TOPIC_UUID);
      expect(result).toEqual([MOCK_LESSON]);
      expect(service.findAllByTopic).toHaveBeenCalledWith(MOCK_TOPIC_UUID);
    });
  });

  describe('findOne', () => {
    it('should return a single lesson', async () => {
      const uuid = 'lesson-uuid-1';
      const result = await controller.findOne(uuid);
      expect(result).toEqual(MOCK_LESSON);
      expect(service.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const uuid = 'lesson-uuid-1';
      const updateLessonDto: UpdateLessonDto = { title: 'Updated Lesson' };

      const result = await controller.update(uuid, updateLessonDto);

      expect(result.title).toEqual('Updated Lesson');
      expect(service.update).toHaveBeenCalledWith(uuid, updateLessonDto);
    });
  });

  describe('remove', () => {
    it('should remove a lesson', async () => {
      const uuid = 'lesson-uuid-1';
      const result = await controller.remove(uuid);

      expect(result).toEqual({
        message: `Lección con UUID ${uuid} eliminada correctamente.`,
      });
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
