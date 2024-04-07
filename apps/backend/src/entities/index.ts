import { EntitySchema } from 'typeorm';
import IngredientEntity from './ingredient.entity';
import RecipeEntity from './recipe.entity';
import UserEntity from './user.entity';

const entities: Array<typeof EntitySchema> = [UserEntity, IngredientEntity, RecipeEntity];

export { IngredientEntity, RecipeEntity, UserEntity };
export default entities;
