import { Test, TestingModule } from '@nestjs/testing';
import { ProtoProfileService } from './proto-profile.service';

describe('ProtoProfileService', () => {
  let service: ProtoProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtoProfileService],
    }).compile();

    service = module.get<ProtoProfileService>(ProtoProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
