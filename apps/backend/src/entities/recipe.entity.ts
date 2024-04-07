import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import IngredientEntity from './ingredient.entity';
import UserEntity from './user.entity';

@Entity({
  name: 'recipes',
})
export default class RecipeEntity extends EntitySchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ type: 'uuid' })
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

  @OneToMany(() => IngredientEntity, ingredient => ingredient.recipe, { eager: true })
  ingredients: IngredientEntity[];

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
