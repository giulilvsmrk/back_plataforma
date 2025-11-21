import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../src/auth/guards/roles.guard';
import { TopicController } from '../src/topic/topic.controller';
import { TopicService } from '../src/topic/topic.service';
import { CreateTopicDto, UpdateTopicDto } from '../src/topic/dto/topic.dto';

const MOCK_COURSE_UUID = 'aee6e53e-5354-40fc-9cb1-e401e61b05e6';
const MOCK_TOPIC = {
  uuid_topic: 'topic-uuid-1',
  name: 'Test Topic',
  orden: 1,
  course: {
    uuid_course: MOCK_COURSE_UUID,
    title: 'Test Course',
    description: 'Test Description',
  },
};

describe('TopicController', () => {
  let controller: TopicController;
  let service: TopicService;

  const mockTopicService = {
    createTopic: jest.fn().mockResolvedValue(MOCK_TOPIC),
    findAll: jest.fn().mockResolvedValue([MOCK_TOPIC]),
    findAllByCourse: jest.fn().mockResolvedValue([MOCK_TOPIC]),
    findOne: jest.fn().mockResolvedValue(MOCK_TOPIC),
    update: jest
      .fn()
      .mockResolvedValue({ ...MOCK_TOPIC, name: 'Updated Topic' }),
    remove: jest.fn().mockResolvedValue({
      message: `Tema con UUID ${MOCK_TOPIC.uuid_topic} eliminado correctamente.`,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TopicController>(TopicController);
    service = module.get<TopicService>(TopicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a topic', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Test Topic',
        orden: 1,
        course_uuid: MOCK_COURSE_UUID,
      };

      const result = await controller.create(createTopicDto);

      expect(result).toEqual(MOCK_TOPIC);
      expect(service.createTopic).toHaveBeenCalledWith(createTopicDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([MOCK_TOPIC]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByCourse', () => {
    it('should return an array of topics for a course', async () => {
      const result = await controller.findAllByCourse(MOCK_COURSE_UUID);
      expect(result).toEqual([MOCK_TOPIC]);
      expect(service.findAllByCourse).toHaveBeenCalledWith(MOCK_COURSE_UUID);
    });
  });

  describe('findOne', () => {
    it('should return a single topic', async () => {
      const uuid = 'topic-uuid-1';
      const result = await controller.findOne(uuid);
      expect(result).toEqual(MOCK_TOPIC);
      expect(service.findOne).toHaveBeenCalledWith(uuid);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const uuid = 'topic-uuid-1';
      const updateTopicDto: UpdateTopicDto = { name: 'Updated Topic' };

      const result = await controller.update(uuid, updateTopicDto);

      expect(result.name).toEqual('Updated Topic');
      expect(service.update).toHaveBeenCalledWith(uuid, updateTopicDto);
    });
  });

  describe('remove', () => {
    it('should remove a topic', async () => {
      const uuid = 'topic-uuid-1';
      const result = await controller.remove(uuid);

      expect(result).toEqual({
        message: `Tema con UUID ${uuid} eliminado correctamente.`,
      });
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
