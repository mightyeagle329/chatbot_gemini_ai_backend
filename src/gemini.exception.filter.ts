import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

@Catch()
export class GeminiApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = 400; // Set the appropriate status code
      const message = ` 👿👿 Exception filtered exception: ${JSON.stringify(
        exception
      )}`; ;

      console.log(
        `... 👿👿👿👿 GeminiApiExceptionFilter Gemini AI ERROR: 👿👿 ctx: ${JSON.stringify(ctx.getRequest)} 👿👿`
      );
      //  console.log(
      //    `... 👿👿👿👿 GeminiApiExceptionFilter Gemini AI ERROR: 👿👿 response: ${JSON.stringify(response.)} 👿👿`
      //  );

      response.status(status).json({
        statusCode: status,
        message: message,
      });
    
  }
}
