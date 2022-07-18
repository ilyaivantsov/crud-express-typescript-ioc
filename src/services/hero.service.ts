import { injectable } from 'inversify';
import { Hero } from '../models/hero.entity';
import { HeroDto } from '../dtos/hero/hero.dto';
import { HeroUpdateDto } from '../dtos/hero/hero.update.dto';

@injectable()
export class HeroService {

    public async create(dto: HeroDto): Promise<{ hero: HeroDto, create: boolean }> {
        const hero = await Hero.findByPk(dto.name);
        if (hero) {
            return { hero: this.modelToDto(hero), create: false };
        }
        await Hero.create(dto);
        return { hero: dto, create: true };
    }

    public async findAll(): Promise<HeroDto[]> {
        const hero = await Hero.findAll();
        return hero.map(this.modelToDto);
    }

    public async findOne(name: string): Promise<HeroDto> {
        const hero = await Hero.findByPk(name);
        if (hero) {
            return this.modelToDto(hero);
        }
        return null;
    }

    public async update(name: string, heroUpdateDto: HeroUpdateDto): Promise<HeroDto> {
        const hero = await Hero.findByPk(name);
        if (!hero)
          return null;
        hero.set(heroUpdateDto);
    
        await hero.save();
    
        return this.modelToDto(hero);
      }

    private modelToDto(model: Hero): HeroDto {
        const dto = new HeroDto();
        const { name, dexterity, strength, isInvincible, intellect } = model;
        Object.assign(dto, { name, dexterity, strength, isInvincible, intellect })
        return dto;
    }

    private dtoToModel(dto: HeroDto): Hero {
        return Hero.build(dto);
    };
}
