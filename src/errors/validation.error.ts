import { HttpError } from './http.error';


export class ValidationError extends HttpError {
  public errors: string[];

  constructor(
    errors: string | string[]
  ) {
    super(400);
    Object.setPrototypeOf(this, ValidationError.prototype);

    this.errors = errors instanceof Array ? errors : [errors];
  }
}
