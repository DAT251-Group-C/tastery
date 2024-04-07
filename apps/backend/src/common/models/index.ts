import { FullIngredient } from './full-ingredient.model';
import { FullRecipe } from './full-recipe.model';
import { Ingredient } from './ingredient.model';
import Recipe from './recipe.model';
import { User } from './user.model';

const models = [User, Ingredient, Recipe, FullRecipe, FullIngredient];

export { FullIngredient, FullRecipe, Ingredient, Recipe, User };
export default models;
