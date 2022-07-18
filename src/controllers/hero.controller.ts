import { inject, injectable } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
import { DtoValidator } from '../decorators/dto-validator.decorator';
import { HeroDto } from '../dtos/hero/hero.dto';
import { HeroService } from '../services/hero.service';
import { ValidationError } from '../errors/validation.error';
import { HeroUpdateDto } from '../dtos/hero/hero.update.dto';

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
            .get(`${this.path}/:name`, this.getOne.bind(this))
            .put(`${this.path}/:name`, this.update.bind(this))
    }

    /**
     * @swagger
     * /hero/:
     *    post:
     *      tags:
     *        - Hero
     *      description: Hero create
     *      produces:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: body
     *          description: Create new hero
     *          required: true
     *          schema:
     *            $ref: '#/definitions/HeroDto'
     *      responses:
     *        201:
     *          description: Hero
     *        400:
     *          description: Bad request
     */
    @DtoValidator(HeroDto)
    private async create(request: Request, response: Response) {
        const dto = request.body;
        const { hero, create } = await this.heroService.create(dto);
        response.status(create ? 201 : 200).send(hero);
    }

    /**
     * @swagger
     * /hero/{name}:
     *    put:
     *      tags:
     *        - Hero
     *      description: Hero update
     *      produces:
     *        - application/json
     *      parameters:
     *        - in: path
     *          name: name
     *          required: true
     *          description: String of the hero name.
     *          schema:
     *            type: string        
     *        - in: body
     *          name: body
     *          required: true
     *          schema:
     *            $ref: '#/definitions/HeroUpdateDto'
     *      responses:
     *        201:
     *          description: Hero
     *        400:
     *          description: Bad request
     */
    @DtoValidator(HeroUpdateDto)
    private async update(request: Request, response: Response) {
        const dto = request.body;
        const name = request.params.name;
        if (!name)
            throw new ValidationError(`name is required`);
        const hero = await this.heroService.update(name, dto);
        if (hero) {
            response.send(hero);
        }
        else {
            throw new ValidationError(`${name} doesn't exist`);
        }
    }

    /**
     * @swagger
     * /hero/:
     *   get:
     *     tags:
     *       - Hero
     *     description: Get All Hero
     *     responses:
     *       200:
     *         description: Hero
     */
    private async getAll(request: Request, response: Response) {
        const heros = await this.heroService.findAll();
        response.send(heros);
    }

    /**
     * @swagger
     * /hero/{name}:
     *   get:
     *     tags:
     *       - Hero
     *     description: Get Hero by name
     *     parameters:
     *       - in: path
     *         name: name
     *         required: true
     *         description: String of the hero name.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Hero
     *       400:
     *         description: Bad request
     */
    private async getOne(request: Request, response: Response) {
        const name = request.params.name;
        const hero = await this.heroService.findOne(name);
        if (hero) {
            response.send(hero);
        }
        else {
            throw new ValidationError(`${name} doesn't exist`);
        }
    }
}
