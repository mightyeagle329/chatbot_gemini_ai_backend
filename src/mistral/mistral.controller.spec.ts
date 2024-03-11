import { Test, TestingModule } from '@nestjs/testing';
import { MistralController } from './mistral.controller';
import { MistralService } from './mistral.service';

describe('MistralController', () => {
  let controller: MistralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MistralController],
      providers: [MistralService],
    }).compile();

    controller = module.get<MistralController>(MistralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
