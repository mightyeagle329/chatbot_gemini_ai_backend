import { Test, TestingModule } from '@nestjs/testing';
import { GeminiTextImageController } from './text_image.controller';
import { GeminiTextImageService } from './text_image.service';

describe('FilesController', () => {
  let controller: GeminiTextImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeminiTextImageController],
      providers: [GeminiTextImageService],
    }).compile();

    controller = module.get<GeminiTextImageController>(GeminiTextImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
