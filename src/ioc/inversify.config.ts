import { Container as InversifyContainer, interfaces, ContainerModule } from 'inversify';
import { App } from "../app";
import { BaseController } from '../controllers/base.controller';
import { HeroController } from '../controllers/hero.controller';
import { SwaggerConfig } from '../swagger/swagger.config';
import { ErrorMiddleware } from '../middlewares/error.middleware';
import { HeroService } from '../services/hero.service';
import { AppConfig } from '../config/app.config';
import { AppLogger } from '../loggers/app.logger';

export class Container {
    private _container: InversifyContainer = new InversifyContainer();

    protected get container(): InversifyContainer {
        return this._container;
    }

    constructor() {
        this.register();
    }

    public getApp(): App {
        return this.container.get(App);
    }

    // https://github.com/inversify/InversifyJS/blob/master/wiki/recipes.md#injecting-dependencies-into-a-function
    private bindDependencies(func: Function, dependencies: any[]): Function {
        let injections = dependencies.map((dependency) => {
            return this.container.get(dependency);
        });
        return func.bind(func, ...injections);
    }

    private register(): void {
        // this._container.load(this.getRepositoriesModule());
        this._container.load(this.getLoggersModule());
        this._container.load(this.getMiddlewaresModule());
        this._container.load(this.getGeneralModule());
        this._container.load(this.getControllersModule());
        this._container.load(this.getServicesModule());

        this._container.bind<App>(App).toSelf();
    }

    private getControllersModule(): ContainerModule {
        return new ContainerModule((bind: interfaces.Bind) => {
            bind<BaseController>(BaseController).to(HeroController);
        });
    }

    private getServicesModule(): ContainerModule {
        return new ContainerModule((bind: interfaces.Bind) => {
            bind<HeroService>(HeroService).toSelf();
        });
    }

    // private getRepositoriesModule(): ContainerModule {
    //     return new ContainerModule((bind: interfaces.Bind) => {
    //         bind<HeroRepository>(HeroRepository).toConstantValue(new HeroRepository(PartnerModel));
    //     });
    // }

    private getLoggersModule(): ContainerModule {
        return new ContainerModule((bind: interfaces.Bind) => {
            bind<AppLogger>(AppLogger).toSelf();
        });
    }

    private getMiddlewaresModule(): ContainerModule {
        return new ContainerModule((bind: interfaces.Bind) => {
            bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
        });
    }

    private getGeneralModule(): ContainerModule {
        return new ContainerModule((bind: interfaces.Bind) => {
            bind<AppConfig>(AppConfig).toSelf().inSingletonScope(),
            bind<SwaggerConfig>(SwaggerConfig).toSelf();
        });
    }
}