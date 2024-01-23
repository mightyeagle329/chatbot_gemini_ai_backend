import { Injectable, HttpServer, HttpException } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";

@Injectable()
export class ExternalApiService {
  constructor(private httpService: HttpServer) {}

  async makePostRequest(url: string, data: any): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.post(url, data);

      return response.data;
    } catch (error) {
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

  async makeGetRequest(url: string): Promise<any> {
    var secret =
      "rsk_867e77cc057d7ec7daec29bd2e64d1dc8956fdc77f08411c7575df54cb03ab648cda6dec47056466";
    const accessKey = "rak_AE0D13504D1AC1D5DF7E";
    const idempotency = new Date().getTime().toString();
    const timestamp = Math.round(new Date().getTime() / 1000); //
    try {
      const headers = {
        access_key: accessKey,
        secret_key: secret,
        timestamp: timestamp,
      };

      const response: AxiosResponse<any> = await axios.get(url, { headers });

      return response.data;
    } catch (error) {
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

  async getPaymentMethods(): Promise<any> {}
}
