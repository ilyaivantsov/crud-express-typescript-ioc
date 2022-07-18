import { inject, injectable } from 'inversify';
import { BaseController } from './base.controller';
import { Request, Response } from "express";
import { DtoValidator } from '../decorators/dto-validator.decorator';
import { HeroDto } from '../dtos/hero/hero.dto';
import { HeroService } from '../services/hero.service';
import { ValidationError } from '../errors/validation.error';
import { HeroUpdateDto } from '../dtos/hero/hero.update.dto';
import { FileUploadService } from '../services/file-upload.service';
import * as multer from 'multer';
import { AppLogger } from '../loggers/app.logger';

@injectable()
export class HeroController extends BaseController {
    @inject(AppLogger) private readonly appLogger: AppLogger;
    @inject(HeroService) private readonly heroService: HeroService;
    @inject(FileUploadService) private readonly fileUploadService: FileUploadService;

    constructor() {
        super('/superhero');
    }

    public initializeRoutes(): void {
        this.router
            .post(`${this.path}`, this.create.bind(this))
            .get(`${this.path}/getHeroStats`, this.getAll.bind(this))
            .post(`${this.path}/uploadHeroImage/:name`, this.uploadAvatar.bind(this))
            .get(`${this.path}/getHeroImage/:name`, this.getFile.bind(this))
            .get(`${this.path}/getHeroStats/:name`, this.getOne.bind(this))
            .put(`${this.path}/setHeroStats/:name`, this.update.bind(this))
    }

    /**
     * @swagger
     * /superhero/getHeroImage/{name}:
     *    get:
     *      tags:
     *        - Hero
     *      description: Get Hero Image by name
     *      produces:
     *        - image/png
     *        - image/gif
     *        - image/jpeg
     *      parameters:
     *        - in: path
     *          name: name
     *          required: true
     *          description: String of the hero name.
     *          schema:
     *            type: string
     *      responses:
     *        201:
     *          description: OK
     */
    private getFile(request: Request, response: Response) {
        const name = request.params.name;
        if (!name)
            throw new ValidationError(`name is required`);
        if (this.fileUploadService.fileExist(name)) {
            this.fileUploadService.sendFile(request, response, name);
            return;
        } else {
            throw new ValidationError(`file doesn't exist`);
        }
    }

    /**
     * @swagger
     * /superhero/uploadHeroImage/{name}:
     *    post:
     *      tags:
     *        - Hero
     *      description: Hero upload Image
     *      produces:
     *        - multipart/form-data
     *      parameters:
     *        - in: path
     *          name: name
     *          required: true
     *          description: String of the hero name.
     *          schema:
     *            type: string        
     *        - in: formData
     *          name: avatar
     *          type: file
     *          description: The file to upload.
     *      responses:
     *        201:
     *          description: Hero
     *        400:
     *          description: Bad request
     */
    private uploadAvatar(request: Request, response: Response) {
        const name = request.params.name;
        if (!name)
            throw new ValidationError(`name is required`);
        this.heroService.findOne(name).then(
            user => {
                if (!user)
                    throw new ValidationError(`${name} doesn't exist`);
                this.fileUploadService.upload(request, response, function (err) {
                    if (err instanceof multer.MulterError) {
                        response.status(400).send(err.message);
                    } else if (err) {
                        // An unknown error occurred when uploading.
                    }

                    response.status(201).send(request.body);
                })
            },
            err => this.appLogger.error
        )
    }



    /**
     * @swagger
     * /superhero/:
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
     * /superhero/setHeroStats/{name}:
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
     * /superhero/getHeroStats:
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
     * /superhero/getHeroStats/{name}:
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
