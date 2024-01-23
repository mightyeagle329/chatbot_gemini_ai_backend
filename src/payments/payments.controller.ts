import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  CustomerRequest,
  CheckoutRequest,
  PlanRequest,
  Product,
} from "src/rapyd/rapyd_models";

@Controller("rapyd")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //PING
  @Get("ping")
  async ping(): Promise<any> {
    return (
      "🔵 Yebo! 🍎 🍎 from Rapyd controller at SgelaAI at " +
      new Date().toISOString()
    );
  }
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
  //CUSTOMERS
  @Post("createCustomer")
  async createCustomers(
    @Body() customerRequest: CustomerRequest
  ): Promise<any> {
    var result = await this.paymentsService.createCustomer(customerRequest);
    return result;
  }
  @Post("createCheckout")
  async createCheckout(@Body() checkoutRequest: CheckoutRequest): Promise<any> {
    var result = await this.paymentsService.createCheckout(checkoutRequest);
    return result;
  }
  @Get("getCustomers")
  async getCustomers(): Promise<any> {
    var result = await this.paymentsService.getCustomers();
    return result;
  }
  //WEB_HOOKS
  @Get("webhook")
  async webhook(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 webhook from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return HttpStatus.OK;
  }
  @Get("paymentComplete")
  async paymentComplete(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 paymentComplete from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return HttpStatus.OK;
  }
  @Get("paymentError")
  async paymentError(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 paymentError from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return HttpStatus.OK;
  }
  @Get("completeCheckout")
  async completeCheckout(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 completeCheckout from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return HttpStatus.OK;
  }
  @Get("cancelCheckout")
  async cancelCheckout(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 cancelCheckout from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`
    );
    return HttpStatus.OK;
  }
}
