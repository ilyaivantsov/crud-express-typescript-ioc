import { HttpError } from '../errors/http.error';
import { ValidationError } from '../errors/validation.error';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';

export interface ErrorResult {
  status: number;
  message: string;
  errors?: string[];
}

@injectable()
export class ErrorMiddleware {

  public handle(error: any, request: Request, response: Response, next: NextFunction): void {
    const result = this.extract(error);
    response
      .status(result.status)
      .send({
        ...result
      });
  }

  public extract(error: any): ErrorResult {
    const status500InternalServerError: number = 500;

    let status = status500InternalServerError;

    if (error instanceof HttpError) {
      status = error.status;
    }

    let message = `Error code ${status}`;

    let errors = null;
    if (error instanceof ValidationError) {
      errors = error.errors;
    }

    const result: ErrorResult = {
      status,
      message,
    }

    if (errors !== null) {
      result.errors = errors;
    }

    return result;
  }
}
