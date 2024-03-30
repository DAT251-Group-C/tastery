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
  ApiCreateInviteDto,
  ApiCreateOrganizationDto,
  ApiCreateProjectDto,
  ApiFullMembership,
  ApiFullOrganization,
  ApiFullOrganizationWithUsers,
  ApiFullProject,
  ApiInvite,
  ApiMembership,
  ApiOrganization,
  ApiPageDto,
  ApiProject,
  ApiRevokeInviteDto,
  ApiSortOrder,
  ApiUpdateMembershipRoleDto,
  ApiUpdateOrganizationDto,
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
   * @tags Memberships
   * @name MembershipControllerGetMemberships
   * @request GET:/v1/memberships
   * @secure
   */
  membershipControllerGetMemberships = (
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
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
        data: ApiMembership[];
      },
      any
    >({
      path: `/v1/memberships`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Memberships
   * @name MembershipControllerGetMembership
   * @request GET:/v1/memberships/{organizationId}
   * @secure
   */
  membershipControllerGetMembership = (organizationId: string, params: RequestParams = {}) =>
    this.http.request<ApiFullMembership, any>({
      path: `/v1/memberships/${organizationId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Memberships
   * @name MembershipControllerGetMembershipsInOrganization
   * @request GET:/v1/organizations/{organizationId}/memberships
   * @secure
   */
  membershipControllerGetMembershipsInOrganization = (
    organizationId: string,
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
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
        data: ApiMembership[];
      },
      any
    >({
      path: `/v1/organizations/${organizationId}/memberships`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Memberships
   * @name MembershipControllerUpdateMembershipRole
   * @request POST:/v1/organizations/{organizationId}/memberships/role
   * @secure
   */
  membershipControllerUpdateMembershipRole = (organizationId: string, data: ApiUpdateMembershipRoleDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}/memberships/role`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Memberships
   * @name MembershipControllerRemoveMembership
   * @request DELETE:/v1/organizations/{organizationId}/memberships/{userId}
   * @secure
   */
  membershipControllerRemoveMembership = (organizationId: string, userId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}/memberships/${userId}`,
      method: 'DELETE',
      secure: true,
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
    this.http.request<ApiFullOrganization[], any>({
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
    this.http.request<ApiOrganization, any>({
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
   * @name OrganizationControllerGetOrganizationById
   * @request GET:/v1/organizations/{organizationId}
   * @secure
   */
  organizationControllerGetOrganizationById = (organizationId: string, params: RequestParams = {}) =>
    this.http.request<ApiFullOrganizationWithUsers, any>({
      path: `/v1/organizations/${organizationId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Organizations
   * @name OrganizationControllerUpdateOrganization
   * @request PATCH:/v1/organizations/{organizationId}
   * @secure
   */
  organizationControllerUpdateOrganization = (organizationId: string, data: ApiUpdateOrganizationDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}`,
      method: 'PATCH',
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
   * @request DELETE:/v1/organizations/{organizationId}
   * @secure
   */
  organizationControllerDeleteOrganization = (organizationId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Projects
   * @name ProjectControllerGetProjects
   * @request GET:/v1/projects
   * @secure
   */
  projectControllerGetProjects = (
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
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
        data: ApiProject[];
      },
      any
    >({
      path: `/v1/projects`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Projects
   * @name ProjectControllerGetProjectsInOrganization
   * @request GET:/v1/organizations/{organizationId}/projects
   * @secure
   */
  projectControllerGetProjectsInOrganization = (
    organizationId: string,
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
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
        data: ApiProject[];
      },
      any
    >({
      path: `/v1/organizations/${organizationId}/projects`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Projects
   * @name ProjectControllerCreateProject
   * @request POST:/v1/organizations/{organizationId}/projects
   * @secure
   */
  projectControllerCreateProject = (organizationId: string, data: ApiCreateProjectDto, params: RequestParams = {}) =>
    this.http.request<ApiProject, any>({
      path: `/v1/organizations/${organizationId}/projects`,
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
   * @tags Projects
   * @name ProjectControllerGetProjectById
   * @request GET:/v1/projects/{projectId}
   * @secure
   */
  projectControllerGetProjectById = (projectId: string, params: RequestParams = {}) =>
    this.http.request<ApiFullProject, any>({
      path: `/v1/projects/${projectId}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Projects
   * @name ProjectControllerUpdateProject
   * @request PATCH:/v1/organizations/{organizationId}/projects/{projectId}
   * @secure
   */
  projectControllerUpdateProject = (projectId: string, organizationId: string, data: ApiCreateProjectDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}/projects/${projectId}`,
      method: 'PATCH',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Projects
   * @name ProjectControllerDeleteProject
   * @request DELETE:/v1/organizations/{organizationId}/projects/{projectId}
   * @secure
   */
  projectControllerDeleteProject = (projectId: string, organizationId: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/organizations/${organizationId}/projects/${projectId}`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerGetInvites
   * @request GET:/v1/invites
   * @secure
   */
  inviteControllerGetInvites = (params: RequestParams = {}) =>
    this.http.request<ApiInvite, any>({
      path: `/v1/invites`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerGetInviteByHash
   * @request GET:/v1/invites/{hash}
   */
  inviteControllerGetInviteByHash = (hash: string, params: RequestParams = {}) =>
    this.http.request<ApiInvite, any>({
      path: `/v1/invites/${hash}`,
      method: 'GET',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerGetOrganizationInvites
   * @request GET:/v1/invites/organization/{organizationId}
   * @secure
   */
  inviteControllerGetOrganizationInvites = (
    organizationId: string,
    query?: {
      order?: ApiSortOrder;
      /**
       * @min 1
       * @default 1
       */
      page?: number;
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
        data: ApiInvite[];
      },
      any
    >({
      path: `/v1/invites/organization/${organizationId}`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerCreateInvite
   * @request POST:/v1/invites/organization/{organizationId}/create
   * @secure
   */
  inviteControllerCreateInvite = (organizationId: string, data: ApiCreateInviteDto, params: RequestParams = {}) =>
    this.http.request<ApiInvite, any>({
      path: `/v1/invites/organization/${organizationId}/create`,
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
   * @tags Invites
   * @name InviteControllerAcceptInvite
   * @request POST:/v1/invites/{hash}/accept
   * @secure
   */
  inviteControllerAcceptInvite = (hash: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/invites/${hash}/accept`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerDeclineInvite
   * @request DELETE:/v1/invites/{hash}/decline
   * @secure
   */
  inviteControllerDeclineInvite = (hash: string, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/invites/${hash}/decline`,
      method: 'DELETE',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Invites
   * @name InviteControllerRevokeInvite
   * @request DELETE:/v1/invites/organization/{organizationId}/revoke
   * @secure
   */
  inviteControllerRevokeInvite = (organizationId: string, data: ApiRevokeInviteDto, params: RequestParams = {}) =>
    this.http.request<void, any>({
      path: `/v1/invites/organization/${organizationId}/revoke`,
      method: 'DELETE',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
