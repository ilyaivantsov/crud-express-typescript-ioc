import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

/**
 * @swagger
 *  definitions:
 *    HeroUpdateDto:
 *      type: object
 *      properties:
 *        strength:
 *          type: number
 *          description: Strength, min 1 max 100
 *        dexterity:
 *          type: number
 *          description: Dexterity, min 1 max 100
 *        intellect:
 *          type: number
 *          description: Intellect, min 1 max 100
 *        isInvincible:
 *          type: boolean
 *          default: true
 *          description: isInvincible true or false
 *      example:
 *         strength: 5
 *         dexterity: 22
 *         intellect: 10
 *         isInvincible: false
 */
export class HeroUpdateDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    strength?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    dexterity?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    intellect?: number;

    @IsOptional()
    @IsBoolean()
    isInvincible?: boolean;
}