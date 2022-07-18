import { injectable } from 'inversify';
import { HeroCreateDto } from '../dtos/hero/hero.create.dto';


@injectable()
export class HeroService {

    public async create(dto: HeroCreateDto): Promise<HeroCreateDto> {
        return dto;
    }
}
