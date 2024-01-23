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
  PaymentMethodResponse,
  PlanListResponse,
  PlanRequest,
  PlanResponse,
  Product,
  ProductListResponse,
  ProductResponse,
  RequiredFieldsResponse,
} from "src/rapyd/rapyd_models";

var accessKey: string = "rak_AE0D13504D1AC1D5DF7E";
const secretKey: string =
  "rsk_867e77cc057d7ec7daec29bd2e64d1dc8956fdc77f08411c7575df54cb03ab648cda6dec47056466";
const contentType: string = "application/json";
const baseUri = "https://sandboxapi.rapyd.net/v1"; //https://sandboxapi.rapyd.net/v1

var salt: string = "";
var timestamp: string = "";
const mm = "🌍🌍🌍🌍🌍🌍 PaymentService 🍎 🍎 ";

// const crypto = require('crypto');
@Injectable()
export class PaymentsService {
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
      console.log(`${mm}... 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎`);
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

  public async getProducts(): Promise<ProductListResponse> {
    console.log(mm + " getProducts: ");

    var sig = this.getRapydSignature(null, "get", "/v1/products");

    var mUrl = baseUri + "/products";
    console.log(`${mm} ... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      console.log(`${mm}... 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎`);
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
      console.log(`${mm}... 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎`);
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
      throw new HttpException("No response received from the server", 500);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        "An error occurred while making the request",
        500
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
      console.log(`\n${mm} 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎\n`);
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
      console.log(`\n${mm} 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎\n`);
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
  public async getPaymentMethodRequiredFields(
    cardType: string
  ): Promise<RequiredFieldsResponse> {
    console.log(mm + " getPaymentMethodRequiredFields: " + cardType);

    var sig = this.getRapydSignature(
      null,
      "get",
      "/v1/payment_methods/required_fields/" + cardType
    );

    var mUrl = baseUri + "/payment_methods/required_fields/" + cardType;
    console.log(`${mm} 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = this.buildHeaders(sig);

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      if (response.status == 200) {
        console.log(`${mm} 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎`);
        const requiredFieldsResponse: RequiredFieldsResponse = plainToInstance(
          RequiredFieldsResponse,
          response.data
        );

        if (requiredFieldsResponse.status.status === "SUCCESS") {
          console.log(
            `${mm} 🍎 🍎 🍎 🍎 .... we cool, required fields found for: ${cardType}\n`
          );
          return requiredFieldsResponse;
        }
      }

      throw new Error(JSON.stringify(response));
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
}
