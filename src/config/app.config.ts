import { inject, injectable } from "inversify";
import { Sequelize } from 'sequelize-typescript';
import { AppLogger } from "../loggers/app.logger";
import { Hero } from "../models/hero.entity";

@injectable()
export class AppConfig {
    @inject(AppLogger) private readonly appLogger: AppLogger;
    public readonly PORT: number = +process.env.PORT;
    public readonly HOST: string = process.env.HOST;
    public readonly API_PATH: string = '/api';

    constructor() {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './db/database.sqlite',
            logging: true
        });

        sequelize.addModels([Hero]);
        sequelize.sync().then(
            () => this.appLogger.debug(`Sequelize connected`),
            err => this.appLogger.error(err, `Sequelize ERROR`),
        );
    }
}