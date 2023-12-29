import { Test, TestingModule } from '@nestjs/testing';
import { TextImageController } from './text_image.controller';
import { TextImageService } from './text_image.service';

describe('FilesController', () => {
  let controller: TextImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextImageController],
      providers: [TextImageService],
    }).compile();

    controller = module.get<TextImageController>(TextImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
