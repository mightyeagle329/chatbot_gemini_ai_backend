import * as mhttps from "https";
import {
  Injectable,
  HttpServer,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import * as CryptoJS from "crypto-js";
import { plainToInstance } from "class-transformer";
import {
  CheckoutRequest,
  CheckoutResponse,
  CustomerListResponse,
  CustomerRequest,
  CustomerResponse,
  PaymentByBankTransferRequest,
  PaymentResponse,
  PaymentByCardRequest,
  PaymentMethodResponse,
  PlanListResponse,
  PlanRequest,
  PlanResponse,
  Product,
  ProductListResponse,
  ProductResponse,
  RequiredFieldsResponse,
  PaymentByWalletRequest,
  PaymentListResponse,
  PaymentLink,
  AddCustomerPaymentMethodRequest,
  PaymentLinkResponse,
  PaymentLinkRequest,
  RequiredFields,
  Fields,
  Field,
  AddCustomerPaymentMethodResponse,
  CustomerPaymentMethodResponse,
} from "src/rapyd/rapyd_models";
import { FirestoreService } from "src/models/models.service";

var accessKey: string = "rak_AE0D13504D1AC1D5DF7E";
const secretKey: string =
  "rsk_867e77cc057d7ec7daec29bd2e64d1dc8956fdc77f08411c7575df54cb03ab648cda6dec47056466";
const contentType: string = "application/json";
const baseUri = "https://sandboxapi.rapyd.net/v1"; //https://sandboxapi.rapyd.net/v1

var salt: string = "";
var timestamp: string = "";
const mm = "🌍🌍🌍🌍🌍🌍 PaymentService 🍎 🍎 ";

const paymentComplete =
  "https://sgela-ai-service-a4oft7zx3q-uk.a.run.app/rapyd/paymentComplete";
const paymentError =
  "https://sgela-ai-service-a4oft7zx3q-uk.a.run.app/rapyd/paymentError";

// const crypto = require('crypto');
@Injectable()
export class PaymentsService {
  constructor(private firestoreService: FirestoreService) {}
  // The access key from Client Portal.

  //   generateRandomString(size: number) {
  //     try {
  //       return CryptoJS.randomBytes(size).toString("hex");
  //     } catch (error) {
  //       console.error("Error generating salt");
  //       throw error;
  //     }
  //   }
  // import * as CryptoJS from 'crypto-js';

  private generateRandomString(size: number): string {
    const randomBytes = CryptoJS.lib.WordArray.random(size);
    const randomString = CryptoJS.enc.Hex.stringify(randomBytes);
    return randomString;
  }

  private concatenate(method: string, path: string, body: string) {
    var toSign =
      method.toLowerCase().trim() +
      path.trim() +
      salt +
      timestamp.trim() +
      accessKey.trim() + // Replace with your actual access key
      secretKey.trim();
    if (body && body.length > 0) {
      toSign += body.trim();
    }
    return toSign;
  }

  private getRapydSignature(
    body: string,
    method: string,
    path: string
  ): string {
    console.log(
      `🌍🌍 getRapydSignature, 🔵 🔵method: ${method} 🔵 body: ${body} 🔵 🔵path: ${path}`
    );

    timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    salt = this.generateRandomString(12);

    console.log("🌍🌍 ..... signature timestamp: " + timestamp);
    console.log("🌍🌍 ..... signature salt: " + salt);

    var toSign = this.concatenate(method, path, body);

    console.log(
      "🌍🌍 ..... signature concatenation: 🔵 🔵 " + toSign + " 🔵 🔵"
    );
    var rapydSignature = this.buildSignature(toSign);
    console.log(
      "🌍🌍 ..... rapydSignature calculated: 🔵 🔵 " + rapydSignature + " 🔵 🔵"
    );
    return rapydSignature;
  }

  private buildSignature(toSign: string) {
    var rapydSignature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(toSign, secretKey)
    );
    rapydSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(rapydSignature)
    );
    console.log(
      "🔵 🔵 🔵 🔵 buildSignature: calculated: 🍎 🍎 🍎 " +
        rapydSignature +
        " 🍎"
    );
    return rapydSignature;
  }

  public async getCountryPaymentMethods(
    countryCode: string
  ): Promise<PaymentMethodResponse> {
    console.log(mm + " getCountryPaymentMethods: " + countryCode);

    var sig = this.getRapydSignature(
      null,
      "get",
      "/v1/payment_methods/country?country=" + countryCode
    );

    var mUrl = baseUri + "/payment_methods/country?country=" + countryCode;
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getCountryPaymentMethods");
      const paymentMethodResponse: PaymentMethodResponse = plainToInstance(
        PaymentMethodResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          paymentMethodResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, payment methods at ${countryCode}: ${paymentMethodResponse.data.length}\n`
      );
      return paymentMethodResponse;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async handleRapydWebhook(payload: any): Promise<any> {
    //check payload type ...
    console.log(`💚 💚 handleRapydWebhook .....`);
    const json = JSON.parse(payload);
    const type: string = json["type"];
    const data: any = json["data"];

    if (type.includes("PAYMENT_SUCCEEDED")) {
      const paid: boolean = data["paid"];
      if (paid) {
        console.log(
          `💚 💚 handle webhook : PAYMENT_SUCCEEDED .....paid ok?: ${paid}`
        );
        await this.writeSuccessfulPayment(json);
      } else {
        console.log(
          `💚 💚 handle webhook : PAYMENT_SUCCEEDED ..... paid failed?: ${paid}`
        );
        await this.writeFailedPayment(json);
      }
    }
    if (type.includes("PAYMENT_COMPLETED")) {
      const paid: boolean = data["paid"];
      console.log(
        `💚 💚 handle webhook : PAYMENT_COMPLETED ..... paid?: ${paid}`
      );
      await this.writeCompletedPayment(json);
    }
    if (type.includes("PAYMENT_FAILED")) {
      const paid: boolean = data["paid"];
      console.log(
        `💚 💚 handle webhook : PAYMENT_COMPLETED ..... paid?: ${paid}`
      );
      await this.writeFailedPayment(json);
    }
  }

  private async writeSuccessfulPayment(payment: any) {
    console.log(` 🍎 🍎 🍎 writeSuccessfulPayment`);
    return this.firestoreService.addPaymentSucceeded(JSON.parse(payment));
  }
  private async writeFailedPayment(payment: any) {
    console.log(` 🍎 🍎 🍎 writeFailedPayment`);
    return this.firestoreService.addPaymentFailed(JSON.parse(payment));
  }
  private async writeCompletedPayment(payment: any) {
    console.log(` 🍎 🍎 🍎 writeCompletedPayment`);
    return this.firestoreService.addPaymentCompleted(JSON.parse(payment));
  }

  public async getProducts(): Promise<ProductListResponse> {
    console.log(mm + " getProducts: ");

    var sig = this.getRapydSignature(null, "get", "/v1/products");

    var mUrl = baseUri + "/products";
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getProducts");
      const productListResponse: ProductListResponse = plainToInstance(
        ProductListResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          productListResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, products found: ${productListResponse.data.length}\n`
      );
      return productListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async getPlans(): Promise<PlanListResponse> {
    console.log(mm + " getPlans: ");

    var sig = this.getRapydSignature(null, "get", "/v1/plans");

    var mUrl = baseUri + "/plans";
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getPlans");
      const planListResponse: PlanListResponse = plainToInstance(
        PlanListResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          planListResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, plans found: ${planListResponse.data.length}\n`
      );
      return planListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  private handleError(error: any) {
    console.log(error.response.data);
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      throw new HttpException(error.response.data, error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      throw new HttpException(
        "No response received from the server",
        HttpStatus.BAD_REQUEST
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        "An error occurred while making the request: " + JSON.stringify(error),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async createProduct(product: Product): Promise<any> {
    console.log(mm + " createProduct: " + JSON.stringify(product));

    var sig = this.getRapydSignature(
      JSON.stringify(product),
      "post",
      "/v1/products"
    );

    var mUrl = baseUri + "/products";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);

      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(product));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createProduct");
      const productResponse: ProductResponse = plainToInstance(
        ProductResponse,
        response.data
      );

      if (productResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            productResponse.status,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, product created: ${productResponse.status.status}\n\n`
        );
        return productResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 productResponse.status.status: ${productResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(productResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }
  public async createPlan(planRequest: PlanRequest): Promise<any> {
    console.log(mm + " createPlan: " + JSON.stringify(planRequest));

    var sig = this.getRapydSignature(
      JSON.stringify(planRequest),
      "post",
      "/v1/plans"
    );

    var mUrl = baseUri + "/plans";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);

      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(planRequest));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createPlan");
      const productResponse: PlanResponse = plainToInstance(
        PlanResponse,
        response.data
      );

      if (productResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            productResponse.status,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, plan created: ${productResponse.status.status}\n\n`
        );
        return productResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 productResponse.status.status: ${productResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(productResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async addCustomerPaymentMethod(
    customer: string,
    type: string
  ): Promise<CustomerPaymentMethodResponse> {
    var rf: RequiredFieldsResponse =
      await this.getPaymentMethodRequiredFields(type);
    console.log(
      `${mm} requiredFields found: ${rf.data.length} for type: ${type}`
    );
    var reqFld: RequiredFields;
    rf.data.forEach((reqField) => {
      if (reqField.type === type) {
        reqFld = reqField;
      }
    });
    var fields: Field[] = [];
    if (reqFld) {
      reqFld.fields.forEach((f) => {
        var m: Field = new Field();
        m.name = f.name;
        m.type = f.type;
        fields.push(m);
      });
      var request: AddCustomerPaymentMethodRequest =
        new AddCustomerPaymentMethodRequest();
      request.type = type;
      request.fields = fields;
      request.complete_payment_url = paymentComplete;
      request.error_payment_url = paymentError;

      console.log(
        `${mm} AddCustomerPaymentMethodRequest: ${JSON.stringify(
          request,
          null,
          2
        )}`
      );
      //
      var sig = this.getRapydSignature(
        JSON.stringify(request),
        "post",
        "/v1/customers/" + customer + "/payment_methods"
      );

      var mUrl = baseUri + "customers/" + customer + "/payment_methods";
      console.log(
        `\n${mm}... 🍎 🍎 addCustomerPaymentMethod 🍎 🍎 mUrl: ${mUrl} 🍎\n`
      );
      try {
        const headers = this.buildHeaders(sig);

        const options = {
          headers: headers,
        };
        var body = JSON.parse(JSON.stringify(request));
        const response: AxiosResponse<any> = await axios.post(
          mUrl,
          body,
          options
        );
        //
        this.weGoodBoss("addCustomerPaymentMethod");
        const customerResponse: CustomerPaymentMethodResponse = plainToInstance(
          CustomerPaymentMethodResponse,
          response.data
        );

        if (customerResponse.status.status === "SUCCESS") {
          console.log(
            `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
              customerResponse.status,
              null,
              2
            )} \n\n`
          );

          console.log(
            `${mm} 🍎 🍎 🍎 🍎 we cool, plan created: ${customerResponse.status.status}\n\n`
          );
          return customerResponse;
        }
        console.log(
          `${mm} 👿👿👿👿 customerResponse.status.status: ${customerResponse.status.status} 👿👿`
        );
        throw new HttpException(
          JSON.stringify(customerResponse),
          HttpStatus.BAD_REQUEST
        );
      } catch (error) {
        this.handleError(error);
      }
    } else {
      throw new HttpException(
        "Payment required fields not found for type: " + type,
        HttpStatus.BAD_REQUEST
      );
    }
  }
  public async createCustomer(customerRequest: CustomerRequest): Promise<any> {
    console.log(mm + " createCustomer: " + JSON.stringify(customerRequest));

    var sig = this.getRapydSignature(
      JSON.stringify(customerRequest),
      "post",
      "/v1/customers"
    );

    var mUrl = baseUri + "/customers";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);

      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(customerRequest));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createCustomer");
      const customerResponse: CustomerResponse = plainToInstance(
        CustomerResponse,
        response.data
      );

      if (customerResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            customerResponse.status,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, plan created: ${customerResponse.status.status}\n\n`
        );
        return customerResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 customerResponse.status.status: ${customerResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(customerResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async createCheckout(checkoutRequest: CheckoutRequest): Promise<any> {
    console.log(mm + " createCheckout: " + JSON.stringify(checkoutRequest));

    var sig = this.getRapydSignature(
      JSON.stringify(checkoutRequest),
      "post",
      "/v1/checkout"
    );

    var mUrl = baseUri + "/checkout";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);
      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(checkoutRequest));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createCheckout");
      const checkoutResponse: CheckoutResponse = plainToInstance(
        CheckoutResponse,
        response.data
      );

      if (checkoutResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            checkoutResponse,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, checkout created: ${checkoutResponse.status.status}\n\n`
        );
        return checkoutResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 customerResponse.status.status: ${checkoutResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(checkoutResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async createPaymentLink(
    paymentLink: PaymentLinkRequest
  ): Promise<any> {
    console.log(mm + " createPaymentLink: " + JSON.stringify(paymentLink));

    var body = JSON.parse(JSON.stringify(paymentLink));
    var sig = this.getRapydSignature(
      body,
      "post",
      "/v1/hosted/collect/payments"
    );

    var mUrl = baseUri + "/hosted/collect/payments";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);
      const options = {
        headers: headers,
      };

      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createPaymentLink");
      const paymentLinkResponse: PaymentLinkResponse = plainToInstance(
        PaymentLinkResponse,
        response.data
      );

      if (paymentLinkResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            paymentLinkResponse,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, paymentLink created: ${paymentLinkResponse.status.status}\n\n`
        );
        return paymentLinkResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 paymentLinkResponse.status.status: ${paymentLinkResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(paymentLinkResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }
  public async createPaymentByBankTransfer(
    request: PaymentByBankTransferRequest
  ): Promise<any> {
    console.log(
      mm + " createPaymentByBankTransfer: " + JSON.stringify(request)
    );

    var sig = this.getRapydSignature(
      JSON.stringify(request),
      "post",
      "/v1/payments"
    );

    var mUrl = baseUri + "/payments";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);
      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(request));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createPaymentByBankTransfer");
      const paymentResponse: PaymentResponse = plainToInstance(
        PaymentResponse,
        response.data
      );

      if (paymentResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            paymentResponse,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, payment by bank transfer created: ${paymentResponse.status.status}\n\n`
        );
        return paymentResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 paymentResponse.status.status: ${paymentResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(paymentResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async createPaymentByWallet(
    request: PaymentByWalletRequest
  ): Promise<any> {
    console.log(mm + " createPaymentByWallet: " + JSON.stringify(request));

    var sig = this.getRapydSignature(
      JSON.stringify(request),
      "post",
      "/v1/payments"
    );

    var mUrl = baseUri + "/payments";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);
      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(request));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createPaymentByWallet");
      const paymentResponse: PaymentResponse = plainToInstance(
        PaymentResponse,
        response.data
      );

      if (paymentResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            paymentResponse,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, payment by wallet created: ${paymentResponse.status.status}\n\n`
        );
        return paymentResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 paymentResponse.status.status: ${paymentResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(paymentResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }
  public async createPaymentByCard(
    request: PaymentByCardRequest
  ): Promise<any> {
    console.log(mm + " createPaymentByCard: " + JSON.stringify(request));

    var sig = this.getRapydSignature(
      JSON.stringify(request),
      "post",
      "/v1/payments"
    );

    var mUrl = baseUri + "/payments";
    console.log(`\n${mm}... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎\n`);

    try {
      const headers = this.buildHeaders(sig);
      const options = {
        headers: headers,
      };
      var body = JSON.parse(JSON.stringify(request));
      const response: AxiosResponse<any> = await axios.post(
        mUrl,
        body,
        options
      );
      //
      this.weGoodBoss("createPaymentByBankTransfer");
      const paymentResponse: PaymentResponse = plainToInstance(
        PaymentResponse,
        response.data
      );

      if (paymentResponse.status.status === "SUCCESS") {
        console.log(
          `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
            paymentResponse,
            null,
            2
          )} \n\n`
        );

        console.log(
          `${mm} 🍎 🍎 🍎 🍎 we cool, payment by card created: ${paymentResponse.status.status}\n\n`
        );
        return paymentResponse;
      }
      console.log(
        `${mm} 👿👿👿👿 paymentResponse.status.status: ${paymentResponse.status.status} 👿👿`
      );
      throw new HttpException(
        JSON.stringify(paymentResponse),
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  public async getCustomers(): Promise<CustomerListResponse> {
    console.log(mm + " getCustomers ................: ");

    var sig = this.getRapydSignature(null, "get", "/v1/customers");

    var mUrl = baseUri + "/customers";
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getCustomers");
      const customerListResponse: CustomerListResponse = plainToInstance(
        CustomerListResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          customerListResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, customers found: ${customerListResponse.data.length}\n`
      );
      return customerListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async getPaymentMethodRequiredFields(
    type: string
  ): Promise<RequiredFieldsResponse> {
    console.log(mm + " getPaymentMethodRequiredFields: " + type);

    var sig = this.getRapydSignature(
      null,
      "get",
      "/v1/payment_methods/required_fields/" + type
    );

    var mUrl = baseUri + "/payment_methods/required_fields/" + type;
    console.log(`${mm} 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      if (response.status == 200) {
        this.weGoodBoss("getPaymentRequiredFields");
        const requiredFieldsResponse: RequiredFieldsResponse = plainToInstance(
          RequiredFieldsResponse,
          response.data
        );

        if (requiredFieldsResponse.status.status === "SUCCESS") {
          console.log(
            `${mm} 🍎 🍎 🍎 🍎 .... we cool, required fields found for: ${type}\n`
          );
          return requiredFieldsResponse;
        }
      }

      throw new Error(JSON.stringify(response));
    } catch (error) {
      this.handleError(error);
    }
  }
  //{{base_uri}}/payments?limit=25&customer=cus_3e44174d031b620daf1ac433c95694d5
  public async getPayments(limit: number): Promise<PaymentListResponse> {
    console.log(mm + " getCustomers ................: ");
    var sig = this.getRapydSignature(null, "get", "/v1/payments");

    var mUrl = baseUri + "/payments?limit=" + limit;
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getPayments");
      const paymentListResponse: PaymentListResponse = plainToInstance(
        PaymentListResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          paymentListResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, customers found: ${paymentListResponse.data.length}\n`
      );
      return paymentListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async retrievePaymentLink(
    paymentLink: string
  ): Promise<PaymentLinkResponse> {
    console.log(mm + " getCustomers ................: ");
    ///v1/hosted/collect/payments/:payment_link
    var sig = this.getRapydSignature(
      null,
      "get",
      `/v1/hosted/collect/payments/${paymentLink}`
    );

    var mUrl = baseUri + `/hosted/collect/payments/${paymentLink}`;
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);
    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("retrievePaymentLink");
      const paymentListResponse: PaymentLinkResponse = plainToInstance(
        PaymentLinkResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          paymentListResponse.status,
          null,
          2
        )} \n\n`
      );

      return paymentListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async getCustomerPayments(
    limit: number,
    customer: string
  ): Promise<PaymentListResponse> {
    console.log(mm + " getCustomerPayments ................: ");
    var sig = this.getRapydSignature(null, "get", "/v1/payments");

    var mUrl = baseUri + "/payments?limit=" + limit + "&customer=" + customer;
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      this.weGoodBoss("getPayments");
      const paymentListResponse: PaymentListResponse = plainToInstance(
        PaymentListResponse,
        response.data
      );

      console.log(
        `${mm} ... 🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          paymentListResponse.status,
          null,
          2
        )} \n\n`
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, customers found: ${paymentListResponse.data.length}\n`
      );
      return paymentListResponse;
    } catch (error) {
      this.handleError(error);
    }
  }
  private buildHeaders(sig: string) {
    const headers = {
      access_key: accessKey,
      salt: salt,
      timestamp: timestamp,
      signature: sig,
      "Content-Type": "application/json",
    };
    console.log(
      `${mm} 🍎 🍎 🍎 🍎 headers: ${JSON.stringify(headers, null, 2)} 🍎`
    );
    return headers;
  }
  private weGoodBoss(name: string) {
    console.log(`\n${mm} 🍎 🍎 ${name} 🍎 🍎 we cool, dog!!! 🥦🥦🥦  🍎\n`);
  }
}
