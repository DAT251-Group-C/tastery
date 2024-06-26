import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import IngredientEntity from './ingredient.entity';
import UserEntity from './user.entity';
import FavoriteEntity from './favorite.entity';

@Entity({
  name: 'recipes',
})
export default class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 2083,
    nullable: false,
    default: '',
  })
  instructions: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @Column({
    type: 'simple-array',
    nullable: false,
    default: [],
  })
  tags: string[];

  @OneToMany(() => IngredientEntity, ingredient => ingredient.recipe, { eager: true, cascade: true })
  ingredients: IngredientEntity[];

  @OneToMany(() => FavoriteEntity, favorite => favorite.recipe, { cascade: true })
  favorites: Promise<FavoriteEntity[]>;

  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;
}
