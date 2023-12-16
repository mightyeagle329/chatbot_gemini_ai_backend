import { Test, TestingModule } from '@nestjs/testing';
import { TextImageService } from './text_image.service';

describe('TextImageService', () => {
  let service: TextImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    service = module.get<TextImageService>(TextImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
