import { Test, TestingModule } from '@nestjs/testing';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';

describe('PaypalController', () => {
  let controller: PaypalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaypalController],
      providers: [PaypalService],
    }).compile();

    controller = module.get<PaypalController>(PaypalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
