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

import {
  ApiCreateFavoriteDto,
  ApiCreateRecipeDto,
  ApiFavorite,
  ApiPageDto,
  ApiRecipe,
  ApiSortOrder,
  ApiUpdateRecipeDto,
  ApiUpdateUserDto,
  ApiUser,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class V1<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags Health
   * @name HealthControllerGetHealth
   * @request GET:/v1/health
   */
  healthControllerGetHealth = (params: RequestParams = {}) =>
    this.http.request<string, any>({
      path: `/v1/health`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetUser
   * @request GET:/v1/users
   * @secure
   */
  userControllerGetUser = (params: RequestParams = {}) =>
    this.http.request<ApiUser, any>({
      path: `/v1/users`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerUpdateUser
   * @request PATCH:/v1/users
   * @secure
   */
  userControllerUpdateUser = (data: ApiUpdateUserDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/users`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerDeleteUser
   * @request DELETE:/v1/users
   * @secure
   */
  userControllerDeleteUser = (params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/users`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name UserControllerGetUserById
   * @request GET:/v1/users/{userId}
   * @secure
   */
  userControllerGetUserById = (userId: string, params: RequestParams = {}) =>
    this.http.request<ApiUser, any>({
      path: `/v1/users/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerGetRecipes
   * @request GET:/v1/recipes
   */
  recipeControllerGetRecipes = (
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      search?: string;
      /**
       * @min 1
       * @max 50
       * @default 10
       */
      take?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiPageDto & {
        data: ApiRecipe[];
      },
      any
    >({
      path: `/v1/recipes`,
      method: 'GET',
      query: query,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerCreateRecipe
   * @request POST:/v1/recipes
   * @secure
   */
  recipeControllerCreateRecipe = (data: ApiCreateRecipeDto, params: RequestParams = {}) =>
    this.http.request<ApiRecipe, any>({
      path: `/v1/recipes`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerGenerateRecipe
   * @request GET:/v1/recipes/generate
   */
  recipeControllerGenerateRecipe = (params: RequestParams = {}) =>
    this.http.request<ApiCreateRecipeDto, any>({
      path: `/v1/recipes/generate`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerGetRecipeById
   * @request GET:/v1/recipes/{recipeId}
   */
  recipeControllerGetRecipeById = (recipeId: string, params: RequestParams = {}) =>
    this.http.request<ApiRecipe, any>({
      path: `/v1/recipes/${recipeId}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerUpdateRecipe
   * @request PATCH:/v1/recipes/{recipeId}
   * @secure
   */
  recipeControllerUpdateRecipe = (recipeId: string, data: ApiUpdateRecipeDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/recipes/${recipeId}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipes
   * @name RecipeControllerDeleteRecipe
   * @request DELETE:/v1/recipes/{recipeId}
   * @secure
   */
  recipeControllerDeleteRecipe = (recipeId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/recipes/${recipeId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Favorites
   * @name FavoriteControllerCreateFavorite
   * @request POST:/v1/favorites
   * @secure
   */
  favoriteControllerCreateFavorite = (data: ApiCreateFavoriteDto, params: RequestParams = {}) =>
    this.http.request<ApiFavorite, any>({
      path: `/v1/favorites`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Favorites
   * @name FavoriteControllerGetFavorites
   * @request GET:/v1/favorites
   * @secure
   */
  favoriteControllerGetFavorites = (
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
      search?: string;
      /**
       * @min 1
       * @max 50
       * @default 10
       */
      take?: number;
    },
    params: RequestParams = {},
  ) =>
    this.http.request<
      ApiPageDto & {
        data: ApiFavorite[];
      },
      any
    >({
      path: `/v1/favorites`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Favorites
   * @name FavoriteControllerDeleteFavorite
   * @request DELETE:/v1/favorites/{favoriteId}
   * @secure
   */
  favoriteControllerDeleteFavorite = (favoriteId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/favorites/${favoriteId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Favorites
   * @name FavoriteControllerCheckFavorite
   * @request GET:/v1/favorites/check/{recipeId}
   * @secure
   */
  favoriteControllerCheckFavorite = (recipeId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/favorites/check/${recipeId}`,
      method: 'GET',
      secure: true,
      ...params,
    });
}
