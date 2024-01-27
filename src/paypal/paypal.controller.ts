import { Controller, Get } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}


  @Get('getAccessToken')
  public async getAccessToken():Promise<string> {
    return this.paypalService.getAccessToken();
  }
}
