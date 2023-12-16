import { Test, TestingModule } from '@nestjs/testing';
import { TextImageController } from './text_image.controller';

describe('FilesController', () => {
  let controller: TextImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [FilesService],
    }).compile();

    controller = module.get<TextImageController>(TextImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
