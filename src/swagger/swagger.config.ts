import { inject, injectable } from "inversify";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { Application, Router } from 'express';
import { AppConfig } from "../config/app.config";

@injectable()
export class SwaggerConfig {
  @inject(AppConfig) private readonly appConfig: AppConfig;

  public initialize(app: Application) {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Title',
          version: '1.0.0',
          description: 'Description',
        },
        schemes: ['http'],
        host: `${this.appConfig.HOST}:${this.appConfig.PORT}`,
        basePath: this.appConfig.API_PATH,
      },
      apis: [
        `./src/controllers/*.controller.ts`,
        `./src/dtos/**/*.dto.ts`,
      ]
    }

    const swaggerSpec = swaggerJSDoc(options);

    const swaggerRouter = Router();
    swaggerRouter.get('/v1/swagger.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
    swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/swagger', swaggerRouter);
  }
}
