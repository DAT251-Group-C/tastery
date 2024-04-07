import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IngredientUnit } from '../common/models/ingredient.model';
import RecipeEntity from './recipe.entity';

@Entity({
  name: 'ingredients',
})
export default class IngredientEntity {
  @PrimaryColumn()
  ean: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2083,
    nullable: true,
  })
  image?: string;

  @PrimaryColumn('uuid')
  recipeId: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: IngredientUnit,
    enumName: 'ingredient_unit',
    nullable: false,
  })
  unit: IngredientUnit;

  @ManyToOne(() => RecipeEntity, recipe => recipe.id, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Promise<RecipeEntity>;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;
}
