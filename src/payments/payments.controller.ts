import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import {
  CustomerRequest,
  CheckoutRequest,
  PlanRequest,
  Product,
  PaymentByBankTransferRequest,
  PaymentByCardRequest,
  PaymentByWalletRequest,
  PaymentLinkRequest,
  AddCustomerPaymentMethodRequest,
} from "src/rapyd/rapyd_models";

@Controller("rapyd")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //PING
  @Get("ping")
  async ping(): Promise<any> {
    var msg =
      `🔵 🔵 🔵 🔵 Yebo! 🍎 🍎 from Rapyd controller at SgelaAI at ` +
      new Date().toISOString() +
      " 🔵 ";
    console.log(msg);
    return msg;
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
    @Query("type") type: string
  ): Promise<any> {
    var result =
      await this.paymentsService.getPaymentMethodRequiredFields(type);
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
  async createCustomer(@Body() customerRequest: CustomerRequest): Promise<any> {
    var result = await this.paymentsService.createCustomer(customerRequest);
    return result;
  }
  @Post("createCheckout")
  async createCheckout(@Body() checkoutRequest: CheckoutRequest): Promise<any> {
    var result = await this.paymentsService.createCheckout(checkoutRequest);
    return result;
  }
  @Post("createPaymentLink")
  async createPaymentLink(
    @Body() paymentLink: PaymentLinkRequest
  ): Promise<any> {
    var result = await this.paymentsService.createPaymentLink(paymentLink);
    return result;
  }
  @Post("createPaymentByBankTransfer")
  async createPaymentByBankTransfer(
    @Body() paymentRequest: PaymentByBankTransferRequest
  ): Promise<any> {
    var result =
      await this.paymentsService.createPaymentByBankTransfer(paymentRequest); //
    return result;
  }
  @Post("createPaymentByCard")
  async createPaymentByCard(
    @Body() paymentRequest: PaymentByCardRequest
  ): Promise<any> {
    var result = await this.paymentsService.createPaymentByCard(paymentRequest); //
    return result;
  }
  @Post("createPaymentByWallet")
  async createPaymentByWallet(
    @Body() paymentRequest: PaymentByWalletRequest
  ): Promise<any> {
    var result =
      await this.paymentsService.createPaymentByWallet(paymentRequest); //
    return result;
  }

  @Get("addCustomerPaymentMethod")
  async addCustomerPaymentMethod(customer: string, type: string): Promise<any> {
    var result = await this.paymentsService.addCustomerPaymentMethod(
      customer,
      type
    ); //
    return result;
  }

  @Get("getCustomers")
  async getCustomers(): Promise<any> {
    var result = await this.paymentsService.getCustomers();
    return result;
  }
  @Get("getCustomerPayments")
  async getCustomerPayments(customer: string, limit: number): Promise<any> {
    var result = await this.paymentsService.getCustomerPayments(
      limit,
      customer
    );
    return result;
  }
  @Get("getPayments")
  async getPayments(limit: number): Promise<any> {
    var result = await this.paymentsService.getPayments(limit);
    return result;
  }
  //WEB_HOOKS
  @Post("webhook")
  async rapydWebhook(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 webhook arrived from RAPYD, check the type! payload: ${JSON.stringify(
        payload,
        null,
        2
      )}  🍎 🍎 🍎 `
    );
    this.paymentsService.handleRapydWebhook(payload);
    return HttpStatus.OK;
  }
  @Post("paymentComplete")
  async paymentComplete(@Body() payload: any): Promise<any> {
    console.log(
      ` 🍎 🍎 🍎 paymentComplete from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )}  🍎 🍎 🍎 `
    );
    return HttpStatus.OK;
  }
  @Post("paymentError")
  async paymentError(@Body() payload: any): Promise<any> {
    console.log(
      ` 👿👿👿👿👿👿👿 paymentError from RAPYD: payload: ${JSON.stringify(
        payload,
        null,
        2
      )} 👿👿👿👿👿👿`
    );
    return HttpStatus.OK;
  }
  @Post("completeCheckout")
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
  @Post("cancelCheckout")
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
