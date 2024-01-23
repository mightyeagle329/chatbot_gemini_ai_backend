import { Test, TestingModule } from '@nestjs/testing';
import { FirestoreController } from './models.controller';
import { FirestoreService } from './models.service';

describe("FirestoreController", () => {
  let controller: FirestoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirestoreController],
      providers: [FirestoreService],
    }).compile();

    controller = module.get<FirestoreController>(FirestoreController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
