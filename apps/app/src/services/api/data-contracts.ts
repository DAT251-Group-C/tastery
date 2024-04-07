/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiUser {
  /** @format uuid */
  id: string;
  /** @format email */
  email: string;
  /** @example "John Doe" */
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ApiUpdateUserDto {
  name?: string;
}

export interface ApiPageMetaDto {
  /** @min 1 */
  page: number;
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  take: number;
  /** @min 1 */
  itemCount: number;
  /** @min 0 */
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiPageDto {
  meta: ApiPageMetaDto;
}

export enum ApiIngredientUnit {
  G = 'g',
  Kg = 'kg',
  Ml = 'ml',
  L = 'l',
  Unit = 'unit',
  Tsp = 'tsp',
  Tbsp = 'tbsp',
  Clove = 'clove',
  Pinch = 'pinch',
  Slice = 'slice',
}

export interface ApiIngredient {
  id: string;
  /** @example "7039010019828" */
  ean: string;
  /** @example "John Doe" */
  name: string;
  /** @format hostname */
  image?: string;
  /** @format uuid */
  recipeId: string;
  amount: number;
  unit: ApiIngredientUnit;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ApiRecipe {
  /** @format uuid */
  id: string;
  /** @format uuid */
  userId: string;
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  ingredients: ApiIngredient[];
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export enum ApiSortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface ApiCreateIngredientDto {
  ean: string;
  amount: number;
  name: string;
  image?: string;
  unit: ApiIngredientUnit;
}

export interface ApiCreateRecipeDto {
  name: string;
  description: string;
  instructions: string;
  tags: string[];
  /** @minItems 1 */
  ingredients: ApiCreateIngredientDto[];
}

export interface ApiUpdateRecipeDto {
  name?: string;
  description?: string;
  instructions?: string;
  tags?: string[];
  /** @minItems 1 */
  ingredients?: ApiCreateIngredientDto[];
}
