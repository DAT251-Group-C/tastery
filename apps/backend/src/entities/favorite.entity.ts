import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import RecipeEntity from './recipe.entity';
import UserEntity from './user.entity';

@Entity({ name: 'favorites' })
export default class FavoriteEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(() => RecipeEntity, recipe => recipe.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'recipeId' })
    recipe: RecipeEntity;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP(6)',
        nullable: false,
      })
      createdAt: string;
}
