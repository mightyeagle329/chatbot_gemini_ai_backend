import * as mhttps from "https";
import { Injectable, HttpServer, HttpException } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import * as CryptoJS from "crypto-js";
import { plainToInstance } from "class-transformer";
import { PaymentMethodResponse } from "src/rapyd/rapyd_models";

var accessKey: string = "rak_AE0D13504D1AC1D5DF7E";
const secretKey: string =
  "rsk_867e77cc057d7ec7daec29bd2e64d1dc8956fdc77f08411c7575df54cb03ab648cda6dec47056466";
const contentType: string = "application/json";
const baseUri = "https://sandboxapi.rapyd.net/v1"; //https://sandboxapi.rapyd.net/v1

var salt: string = "";
var timestamp: string = "";

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

  private generateRapydSignature(request: any, method: string, path: string) {
    timestamp = Math.floor(new Date().getTime() / 1000 - 10).toString();
    console.log("🍐🍐 timestamp: " + timestamp);

    salt = this.generateRandomString(12);
    console.log("🍐🍐 salt: " + salt);

    var body = "";
    if (
      JSON.stringify(request) !== "{}" &&
      request !== "" &&
      typeof request !== "object"
    ) {
      body = JSON.stringify(JSON.parse(request));
    }
    console.log("🍐🍐 body: " + body);
    console.log("🍐🍐 secret key: " + secretKey);
    console.log("🍐🍐 path: " + path);

    var toSign = this.concatenate(method, path, body);

    console.log("🍐🍐 concatenated string: " + toSign.trim());

    const rapydSignature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA256(toSign.trim(), secretKey)
    );
    console.log(
      "🍐🍐 🍎🍎 generateRapydSignature: 🍎🍎 rapyd_signature " + rapydSignature
    );

    return rapydSignature;
  }

  private concatenate(method: string, path: string, body: string) {
    var toSign =
      method.toLowerCase().trim() +
      path.trim() +
      salt +
      timestamp.trim() +
      accessKey.trim() + // Replace with your actual access key
      secretKey.trim();
    if (body.length > 0) {
      toSign += body.trim();
    }
    return toSign;
  }

  private getRapydSignature(
    request: any,
    method: string,
    path: string
  ): string {
    console.log(`🌍🌍 getRapydSignature: ${method} ${request}`);

    timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    salt = this.generateRandomString(12);

    console.log("🌍🌍 ..... signature timestamp: " + timestamp);
    console.log("🌍🌍 ..... signature salt: " + salt);

    var body = "";
    if (
      JSON.stringify(request) !== "{}" &&
      request !== "" &&
      typeof request !== "object"
    ) {
      body = JSON.stringify(JSON.parse(request));
    }
    console.log("🌍🌍 ..... signature body: " + body);

    var toSign = this.concatenate(method, path, body);

    console.log(
      "🌍🌍 ..... signature concatenation: 🔵 🔵 " + toSign + " 🔵 🔵"
    );
    var rapydSignature = this.buildSignature(toSign);
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
    console.log("🌍🌍 getCountryPaymentMethods: " + countryCode);

    var sig = this.getRapydSignature(
      null,
      "get",
      "/v1/payment_methods/country?country=" + countryCode
    );
    // var sig2 = this.generateRapydSignature(
    //   null,
    //   "get",
    //   "/v1/payment_methods/country?country=" + countryCode
    // );

    console.log(`... 🍎 🍎 🍎 🍎 sig: ${sig} 🍎`);
    // console.log(`... 🍎 🍎 🍎 🍎 sig2: ${sig2} 🍎`);

    var mUrl = baseUri + "/payment_methods/country?country=" + countryCode;
    console.log(`... 🍎 🍎 🍎 🍎 mUrl: ${mUrl} 🍎`);

    try {
      const headers = {
        access_key: accessKey,
        salt: salt,
        timestamp: timestamp,
        signature: sig,
        "Content-Type": "application/json",
      };

      console.log(
        `... 🍎 🍎 🍎 🍎 headers, check salt!: ${JSON.stringify(
          headers,
          null,
          2
        )} 🍎`
      );

      const response: AxiosResponse<any> = await axios.get(mUrl, { headers });
      console.log(`... 🍎 🍎 🍎 🍎 we cool, dog!!!! 🥦🥦🥦  🍎`);
      const paymentMethodResponse: PaymentMethodResponse = plainToInstance(
        PaymentMethodResponse,
        response.data
      );

      console.log(
        `🍎 🍎 🍎 🍎 we cool, status: ${JSON.stringify(
          paymentMethodResponse.status
        )} \n\n`
      );
      console.log(
        `🍎 🍎 🍎 🍎 we cool, data: ${JSON.stringify(
          paymentMethodResponse.data
        )}\n`
      );

      return paymentMethodResponse;
    } catch (error) {
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
  }
}
