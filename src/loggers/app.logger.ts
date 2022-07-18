import { injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { BaseLogger } from "./base.logger";

@injectable()
export class AppLogger extends BaseLogger {
    public type: string = 'App';

    public requestLog(request: Request, response: Response, next: NextFunction): void {
        if (!request.url.startsWith('/swagger/')) {
            let query = '';
            for (let propName in request.query) {
                if (request.query.hasOwnProperty(propName)) {
                    query += `'${propName}:${request.query[propName]}' `;
                }
            }

            this.debug(`${request.method} '${request.path}' ${query} ${JSON.stringify(request.body)}`);
        }
        next();
    }
}