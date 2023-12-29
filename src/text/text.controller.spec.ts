import { Test, TestingModule } from '@nestjs/testing';
import { TextController } from './text.controller';
import { TextService } from './text.service';

describe('TextController', () => {
  let controller: TextController;
  let service: TextService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextController],
    }).compile();

    controller = module.get<TextController>(TextController);
  });

  it('should be defined', () => {
    service = module.get<TextService>(TextService);
    expect(controller).toBeDefined();
  });
});
