import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app_controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app_controller = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World the Nestjs"', () => {
      expect(app_controller.getHello()).toBe('Hello World the Nestjs');
    });
  });
});
