import { Test, TestingModule } from '@nestjs/testing';
import { PersonalService } from './personal.service';

describe('PersonalService', () => {
  let service: PersonalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalService],
    }).compile();

    service = module.get<PersonalService>(PersonalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
