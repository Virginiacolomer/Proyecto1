import { Test, TestingModule } from '@nestjs/testing';
import { PersonalController } from './personal.controller';
import { PersonalService } from '../services/personal.service';

describe('PersonalController', () => {
  let controller: PersonalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalController],
      providers: [PersonalService],
    }).compile();

    controller = module.get<PersonalController>(PersonalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
