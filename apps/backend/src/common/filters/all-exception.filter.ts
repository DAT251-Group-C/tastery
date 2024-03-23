import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // TODO: How do we log errors!!!!
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody;

    const ctx = host.switchToHttp();

    if (process.env.ENVIRONMENT === 'local') {
      console.log('*************************Exception*Begin*******************************');
      console.log(exception);
      console.log('*************************Exception*End*********************************');
    }

    if (typeof exception === 'string' && isNaN(Number(exception))) {
      const newException = new BadRequestException(exception, {
        cause: new Error(),
        description: exception,
      });
      httpStatus = newException.getStatus();
      responseBody = newException.getResponse();
    }

    if (typeof exception === 'object' && !(exception instanceof HttpException)) {
      const newException = new BadRequestException(exception, {
        cause: new Error(),
        description: JSON.stringify(exception),
      });
      httpStatus = newException.getStatus();
      responseBody = {
        statusCode: httpStatus,
        message: newException.message,
      };
    }

    if (!isNaN(Number(exception))) {
      const newException = new HttpException('', Number(exception));
      httpStatus = newException.getStatus();
      responseBody = newException.getResponse();
    }

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = {
        statusCode: httpStatus,
        message: this.getExceptionMessage(exception.getResponse()),
      };
    }

    if (!responseBody) {
      const responseError = new HttpException(String(exception), HttpStatus.INTERNAL_SERVER_ERROR);
      responseBody = {
        statusCode: httpStatus,
        message: responseError.message,
      };
    }

    if (typeof responseBody === 'object') {
      responseBody = {
        ...responseBody,
        timestamp: new Date().toISOString(),
        // path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private getExceptionMessage(exception: string | object): string | string[] {
    // the function takes an argument called "exception", which can be either a string or an object.
    switch (typeof exception) {
      // check the type of the "exception" argument.
      case 'object': {
        // if it's an object, check if it has a "message" property that is a string and has multiple lines.
        const message = Object.hasOwn(exception, 'message') ? (exception as { message: unknown })['message'] : null;
        return message && typeof message === 'string' && message.split('\n').length > 1
          ? message.split('\n')[0] // if it does, return the first line of the message
          : String(message); // if it doesn't, return the entire message
      }
      default:
        // if it's not an object, just return the exception as is (assuming it's a string)
        return exception;
    }
  }
}
