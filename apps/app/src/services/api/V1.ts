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
  ApiCreateOrganizationDto,
  ApiOrganizationEntity,
  ApiUpdateOrganizationDto,
  ApiUpdateUserDto,
  ApiUserEntity,
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
    this.http.request<ApiUserEntity, any>({
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
   * @request PUT:/v1/users
   * @secure
   */
  userControllerUpdateUser = (data: ApiUpdateUserDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/users`,
      method: 'PUT',
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
    this.http.request<ApiUserEntity, any>({
      path: `/v1/users/${userId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Organizations
   * @name OrganizationControllerGetOrganizations
   * @request GET:/v1/organizations
   * @secure
   */
  organizationControllerGetOrganizations = (params: RequestParams = {}) =>
    this.http.request<ApiOrganizationEntity[], any>({
      path: `/v1/organizations`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Organizations
   * @name OrganizationControllerCreateOrganization
   * @request POST:/v1/organizations
   * @secure
   */
  organizationControllerCreateOrganization = (data: ApiCreateOrganizationDto, params: RequestParams = {}) =>
    this.http.request<ApiOrganizationEntity, any>({
      path: `/v1/organizations`,
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
   * @tags Organizations
   * @name OrganizationControllerUpdateOrganization
   * @request PUT:/v1/organizations
   * @secure
   */
  organizationControllerUpdateOrganization = (organizationId: string, data: ApiUpdateOrganizationDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Organizations
   * @name OrganizationControllerDeleteOrganization
   * @request DELETE:/v1/organizations
   * @secure
   */
  organizationControllerDeleteOrganization = (organizationId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Organizations
   * @name OrganizationControllerGetOrganizationById
   * @request GET:/v1/organizations/{organizationId}
   * @secure
   */
  organizationControllerGetOrganizationById = (organizationId: string, params: RequestParams = {}) =>
    this.http.request<ApiOrganizationEntity, any>({
      path: `/v1/organizations/${organizationId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
