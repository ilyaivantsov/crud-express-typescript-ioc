import { Router } from 'express';
import { injectable } from 'inversify';
import PromiseRouter from "express-promise-router";

@injectable()
export abstract class BaseController {

  public readonly path: string;
  public readonly router: Router;

  public abstract initializeRoutes(): void;

  constructor(path: string = '') {
    if (!path) {
      throw new Error(`Parameter 'path' can not be empty.`);
    }

    this.router = PromiseRouter();
    this.path = path;
  }
}
