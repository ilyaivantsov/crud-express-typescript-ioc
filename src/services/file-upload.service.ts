import { injectable } from 'inversify';
import { Request, Response } from "express";
import * as fs from 'fs';
import * as multer from 'multer';

@injectable()
export class FileUploadService {
    private readonly DIR: string = './uploads';

    private readonly storage = multer.diskStorage({
        destination: function (request: Request, file, cb) {
            cb(null, './uploads')
        },
        filename: function (request: Request, file, cb) {
            cb(null, `${request.params.name}.jpeg` || 'default.jpeg')
        }
    });

    public readonly upload = multer({ storage: this.storage }).single('avatar');

    constructor() {
        if (!fs.existsSync(this.DIR)) {
            fs.mkdirSync(this.DIR)
        }
    }

    public fileExist(filename: string): boolean {
        return fs.existsSync(`${this.DIR}/${filename}.jpeg`);
    }

    public sendFile(request: Request, response: Response, filename: string) {
        response.sendFile(`${filename}.jpeg`, { root: this.DIR });
    }
}
