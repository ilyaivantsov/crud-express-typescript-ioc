import { inject, injectable } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
import { DtoValidator } from '../decorators/dto-validator.decorator';
import { HeroCreateDto } from '../dtos/hero/hero.create.dto';
import { HeroService } from '../services/hero.service';

@injectable()
export class HeroController extends BaseController {
    @inject(HeroService) private readonly heroService: HeroService;

    constructor() {
        super('/hero');
    }

    public initializeRoutes(): void {
        this.router
            .post(`${this.path}`, this.create.bind(this))
            .get(`${this.path}`, this.getAll.bind(this))
    }

    /**
       * @swagger
       * /hero/:
       *    post:
       *      tags:
       *        - hero
       *      description: Hero create
       *      produces:
       *        - application/json
       *      parameters:
       *        - in: body
       *          name: body
       *          description: Login data (email and password)
       *          required: true
       *          schema:
       *            $ref: '#/definitions/HeroCreateDto'
       *      responses:
       *        201:
       *          description: Hero
       *        400:
       *          description: Bad request
       */
    @DtoValidator(HeroCreateDto)
    private async create(request: Request, response: Response) {
        const dto = request.body;
        const hero = await this.heroService.create(dto);
        response.status(201).send(hero);
    }

    private async getAll(request: Request, response: Response) {

    }

}
