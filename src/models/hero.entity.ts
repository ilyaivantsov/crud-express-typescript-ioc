import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
} from 'sequelize-typescript';

@Table({
    tableName: 'hero',
})
export class Hero extends Model<Hero> {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
    })
    name: string;

    @Column
    strength: number;

    @Column
    dexterity: number;

    @Column
    intellect: number;

    @Column({ field: 'is_invincible' })
    isInvincible: boolean;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @DeletedAt
    @Column({ field: 'deleted_at' })
    deletedAt: Date;
}