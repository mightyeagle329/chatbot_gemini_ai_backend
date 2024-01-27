import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { randomUUID } from "crypto";
require("dotenv").config();
// var request = require("request");
import * as request from "request";

const authSuffix = "oauth2/token";
const mm = "🔵 🔵 🔵 🔵 🔵 PaypalService 🔵";
@Injectable()
export class PaypalService {
  public async createProduct(): Promise<any> {
    /*
    var fetch = require('node-fetch');

fetch('https://api-m.sandbox.paypal.com/v1/catalogs/products', {
    method: 'POST',
    headers: {
        'X-PAYPAL-SECURITY-CONTEXT': '{"consumer":{"accountNumber":1181198218909172527,"merchantId":"5KW8F2FXKX5HA"},"merchant":{"accountNumber":1659371090107732880,"merchantId":"2J6QB8YJQSJRJ"},"apiCaller":{"clientId":"AdtlNBDhgmQWi2xk6edqJVKklPFyDWxtyKuXuyVT-OgdnnKpAVsbKHgvqHHP","appId":"APP-6DV794347V142302B","payerId":"2J6QB8YJQSJRJ","accountNumber":"1659371090107732880"},"scopes":["https://api-m.paypal.com/v1/subscription/.*","https://uri.paypal.com/services/subscription","openid"]}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': 'PRODUCT-18062019-001',
        'Prefer': 'return=representation'
    },
    body: JSON.stringify(
        { "name": "Video Streaming Service", "description": "Video streaming service", 
        "type": "SERVICE", "category": "SOFTWARE", "image_url": "https://example.com/streaming.jpg", 
        "home_url": "https://example.com/home" })
});

    */
  }
  public async createPlan(): Promise<any> {
    /*
    var fetch = require('node-fetch');

fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
    method: 'POST',
    headers: {
        'X-PAYPAL-SECURITY-CONTEXT': '{"consumer":{"accountNumber":1181198218909172527,"merchantId":"5KW8F2FXKX5HA"},"merchant":{"accountNumber":1659371090107732880,"merchantId":"2J6QB8YJQSJRJ"},"apiCaller":{"clientId":"AdtlNBDhgmQWi2xk6edqJVKklPFyDWxtyKuXuyVT-OgdnnKpAVsbKHgvqHHP","appId":"APP-6DV794347V142302B","payerId":"2J6QB8YJQSJRJ","accountNumber":"1659371090107732880"},"scopes":["https://api-m.paypal.com/v1/subscription/.*","https://uri.paypal.com/services/subscription","openid"]}',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'PayPal-Request-Id': 'PLAN-18062019-001',
        'Prefer': 'return=representation'
    },
    body: JSON.stringify({ "product_id": "PROD-XXCD1234QWER65782", 
    "name": "Video Streaming Service Plan", "description": "Video Streaming Service basic plan", 
    "status": "ACTIVE", "billing_cycles": [ { "frequency": { "interval_unit": "MONTH", "interval_count": 1 }, 
    "tenure_type": "TRIAL", "sequence": 1, "total_cycles": 2, "pricing_scheme": { "fixed_price": { "value": "3", "currency_code": "USD" } } }, 
    { "frequency": { "interval_unit": "MONTH", "interval_count": 1 }, "tenure_type": "TRIAL", "sequence": 2, "total_cycles": 3, 
    "pricing_scheme": { "fixed_price": { "value": "6", "currency_code": "USD" } } }, { "frequency": { "interval_unit": "MONTH", "interval_count": 1 }, 
    "tenure_type": "REGULAR", "sequence": 3, "total_cycles": 12, "pricing_scheme": { "fixed_price": { "value": "10", "currency_code": "USD" } } } ], 
    "payment_preferences": { "auto_bill_outstanding": true, "setup_fee": { "value": "10", "currency_code": "USD" }, 
    "setup_fee_failure_action": "CONTINUE", "payment_failure_threshold": 3 }, 
    "taxes": { "percentage": "10", "inclusive": false } })
});

    */
  }

  public async activatePlan(): Promise<any> {
    /*
    var fetch = require('node-fetch');

        fetch('https://api-m.sandbox.paypal.com/v1/billing/plans/P-7GL4271244454362WXNWU5NQ/activate', {
            method: 'POST',
            headers: {
                'X-PAYPAL-SECURITY-CONTEXT': '{"consumer":
                {"accountNumber":1181198218909172527,"merchantId":"5KW8F2FXKX5HA"},
                "merchant":{"accountNumber":1659371090107732880,
                "merchantId":"2J6QB8YJQSJRJ"},
                "apiCaller":{"clientId":"AdtlNBDhgmQWi2xk6edqJVKklPFyDWxtyKuXuyVT-OgdnnKpAVsbKHgvqHHP",
                "appId":"APP-6DV794347V142302B","payerId":"2J6QB8YJQSJRJ","accountNumber":"1659371090107732880"},
                "scopes":["https://api-m.paypal.com/v1/subscription/.*",
                "https://uri.paypal.com/services/subscription","openid"]}',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

    */
  }
  public async createSubscription(): Promise<any> {
    /*
    var fetch = require('node-fetch');

        fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer A21AAGHr9qtiRRXH4oYcQokQgV99rGqEIfgrr8xHCclP0OzmD9KVgg5ppIIg1jzJgQkV4wd02svIvBJyg6cLFJjFow_SjBhxQ',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'PayPal-Request-Id': 'SUBSCRIPTION-21092019-001',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ "plan_id": "P-5ML4271244454362WXNWU5NQ", 
            "start_time": "2018-11-01T00:00:00Z", "quantity": "20", 
            "shipping_amount": { "currency_code": "USD", "value": "10.00" }, 
            "subscriber": { "name": { "given_name": "John", "surname": "Doe" }, 
            "email_address": "customer@example.com", 
            "shipping_address": { "name": { "full_name": "John Doe" }, "address": { "address_line_1": "2211 N First Street", "address_line_2": "Building 17", 
            "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95131", "country_code": "US" } } }, 
            "application_context": { "brand_name": "walmart", "locale": "en-US", 
            "shipping_preference": "SET_PROVIDED_ADDRESS", "user_action": "SUBSCRIBE_NOW", 
            "payment_method": { "payer_selected": "PAYPAL", "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED" }, 
            "return_url": "https://example.com/returnUrl", "cancel_url": "https://example.com/cancelUrl" } })
        });

    */
  }

  public async activateSubscription(): Promise<any> {
    /*
    var fetch = require('node-fetch');

        fetch('https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-BW452GLLEP1G/activate', {
            method: 'POST',
            headers: {
                'X-PAYPAL-SECURITY-CONTEXT': '{"consumer":{"accountNumber":1181198218909172527,
                "merchantId":"5KW8F2FXKX5HA"},"merchant":{"accountNumber":1659371090107732880,
                "merchantId":"2J6QB8YJQSJRJ"},
                "apiCaller":{"clientId":"AdtlNBDhgmQWi2xk6edqJVKklPFyDWxtyKuXuyVT-OgdnnKpAVsbKHgvqHHP",
                "appId":"APP-6DV794347V142302B","payerId":"2J6QB8YJQSJRJ","accountNumber":"1659371090107732880"},
                "scopes":["https://api-m.paypal.com/v1/subscription/.*","https://uri.paypal.com/services/subscription","openid"]}',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ "reason": "Reactivating the subscription" })
        });

    */
  }

  async getAccessToken(): Promise<string> {
    console.log(`${mm} ... getAccessToken ............`);

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const status = process.env.STATUS;
    const grantType = "client_credentials";
    var prefix = process.env.PAYPAL_SANDBOX_URL;
    if (status === "dev") {
      prefix += authSuffix;
    } else {
      prefix = process.env.PAYPAL_LIVE_URL + authSuffix;
    }
    const auth = {
      user: clientId,
      pass: secret,
    };

    const formData = {
      grant_type: grantType,
    };

    const options = {
      url: prefix,
      method: "POST",
      auth,
      form: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "Accept-Language": "en_US",
      },
    };

    return new Promise<string>((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          console.log(`${mm} getAccessToken: ERROR: ${error}`);
          reject(new Error("Really failed to get access token"));
        } else {
          const data = JSON.parse(body);
          const token = data.access_token;
          console.log(`${mm} ... getAccessToken found by PayPal : ${token}`);
          resolve(token);
        }
      });
    });
  }
  private async handleRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Request failed: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public async get<T>(url: string): Promise<T> {
    console.log(`${mm} ... post, url : ${url}`);

    var prefix = this.getUrl();
    var accessToken = await this.getAccessToken();
    var key = randomUUID.toString();
    const config: AxiosRequestConfig = {
      method: "GET",
      url: `${prefix}${url}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "PayPal-Request-Id": "PLAN-18062019-001",
        Prefer: "return=representation",
      },
    };

    return this.handleRequest<T>(config);
  }

  private getUrl() {
    const status = process.env.STATUS;
    console.log(`status: ${status}`);
    var prefix = "";
    if (status === "dev") {
      prefix = process.env.PAYPAL_SANDBOX_URL;
    } else {
      prefix = process.env.PAYPAL_LIVE_URL;
    }
    return prefix;
  }

  public async post<T>(url: string, data: any): Promise<T> {
    console.log(`${mm} ... post, url : ${url}`);

    var prefix = this.getUrl();
    var accessToken = await this.getAccessToken();
    const config: AxiosRequestConfig = {
      method: "POST",
      url: `${prefix}${url}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "PayPal-Request-Id": "PLAN-18062019-001",
        Prefer: "return=representation",
      },
      data: JSON.stringify(data),
    };

    return this.handleRequest<T>(config);
  }
}
