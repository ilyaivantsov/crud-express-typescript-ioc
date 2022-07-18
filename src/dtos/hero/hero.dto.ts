import { IsBoolean, IsNumber, IsString, Max, Min, MinLength } from 'class-validator';

/**
 * @swagger
 *  definitions:
 *    HeroDto:
 *      type: object
 *      required:
 *        - name
 *        - strength
 *        - dexterity
 *        - intellect
 *        - isInvincible
 *      properties:
 *        name:
 *          type: string
 *          description: Hero's name
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
 *         name: Aquaman
 *         strength: 50
 *         dexterity: 20
 *         intellect: 66
 *         isInvincible: true
 */
export class HeroDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  strength: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  dexterity: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  intellect: number;

  @IsBoolean()
  isInvincible: boolean;
}
