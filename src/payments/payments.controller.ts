import { Controller, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("getCountryPaymentMethods")
  async getCountryPaymentMethods(
    @Query("countryCode") countryCode: string
  ): Promise<any> {
    var result =
      await this.paymentsService.getCountryPaymentMethods(countryCode);
    return result;
  }
}
