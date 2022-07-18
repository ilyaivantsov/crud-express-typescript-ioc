import { inject, injectable, multiInject } from 'inversify';
import * as cors from 'cors';
import * as express from 'express';
import { BaseController } from './controllers/base.controller';
import { SwaggerConfig } from './swagger/swagger.config';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { AppConfig } from './config/app.config';
import { AppLogger } from './loggers/app.logger';

@injectable()
export class App {
    @inject(SwaggerConfig) private readonly swaggerConfig: SwaggerConfig;
    private app: express.Application = express();

    @multiInject(BaseController) private controllers: BaseController[];
    @inject(ErrorMiddleware) private readonly errorMiddleware: ErrorMiddleware;
    @inject(AppConfig) private readonly appConfig: AppConfig;
    @inject(AppLogger) private readonly appLogger: AppLogger;

    public initialize(): void {
        this.initializePreMiddlewares();
        this.initializeControllers();
        this.initializePostMiddlewares();
    }

    public listen() {
        this.app.listen(this.appConfig.PORT, () => {
            this.swaggerConfig.initialize(this.app);
        });
    }

    private initializePreMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(this.appLogger.requestLog.bind(this.appLogger));
    }

    private initializeControllers(): void {
        this.app.get('/', (req, res) => {
            res.redirect('/swagger');
        });

        this.controllers.forEach((controller: BaseController) => {
            controller.initializeRoutes();
            this.app.use(this.appConfig.API_PATH, controller.router);
            this.appLogger.debug(`Registered '${this.appConfig.API_PATH}${controller.path}'.`);
        });
    }

    private initializePostMiddlewares(): void {
        this.app.use(this.errorMiddleware.handle.bind(this.errorMiddleware));
    }
}
