import { Test, TestingModule } from '@nestjs/testing';
import { ProtoProfileController } from './proto-profile.controller';

describe('ProtoProfileController', () => {
  let controller: ProtoProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtoProfileController],
    }).compile();

    controller = module.get<ProtoProfileController>(ProtoProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
