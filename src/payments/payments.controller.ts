import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PlanRequest, Product } from 'src/rapyd/rapyd_models';

@Controller("rapyd")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //PAYMENT METHODS
  @Get("getCountryPaymentMethods")
  async getCountryPaymentMethods(
    @Query("countryCode") countryCode: string
  ): Promise<any> {
    var result =
      await this.paymentsService.getCountryPaymentMethods(countryCode);
    return result;
  }

  @Get("getPaymentMethodRequiredFields")
  async getPaymentMethodRequiredFields(
    @Query("cardType") cardType: string
  ): Promise<any> {
    var result =
      await this.paymentsService.getPaymentMethodRequiredFields(cardType);
    return result;
  }
//PRODUCTS
  @Get("getProducts")
  async getProducts(): Promise<any> {
    var result = await this.paymentsService.getProducts();
    return result;
  }
  //
  @Post("createProduct")
  async createProduct(@Body() product: Product): Promise<any> {
    var result = await this.paymentsService.createProduct(product);
    return result;
  }
  //PLANS
  @Get("getPlans")
  async getPlans(): Promise<any> {
    var result = await this.paymentsService.getPlans();
    return result;
  }
  @Post("createPlan")
  async createPlan(@Body() planRequest: PlanRequest): Promise<any> {
    var result = await this.paymentsService.createPlan(planRequest);
    return result;
  }
}
