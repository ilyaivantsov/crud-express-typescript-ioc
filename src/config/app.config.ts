import { injectable } from "inversify";

@injectable()
export class AppConfig {
    public readonly PORT: number = +process.env.PORT;
    public readonly HOST: string = process.env.HOST;
    public readonly API_PATH: string = '/api';
}