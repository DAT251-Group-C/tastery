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

export enum ApiMembershipRole {
  Owner = 'Owner',
  Admin = 'Admin',
  User = 'User',
}

export interface ApiMembership {
  /** @format uuid */
  organizationId: string;
  /** @format uuid */
  userId: string;
  role: ApiMembershipRole;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export enum ApiSortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface ApiOrganization {
  /** @format uuid */
  id: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface ApiFullMembership {
  /** @format uuid */
  organizationId: string;
  /** @format uuid */
  userId: string;
  role: ApiMembershipRole;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  organization: ApiOrganization;
  user: ApiUser;
}

export interface ApiUpdateMembershipRoleDto {
  /** @example "Admin" */
  role: ApiMembershipRole;
  /** @format uuid */
  userId: string;
}

export interface ApiProject {
  /** @format uuid */
  id: string;
  /** @format uuid */
  organizationId: string;
  name: string;
  description: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  referrerUrls: string[];
  apiKey: string;
}

export interface ApiTool {
  /** @format uuid */
  id: string;
  /** @format uuid */
  projectId: string;
  name: string;
  description: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  parameters: object;
}

export interface ApiFullProject {
  /** @format uuid */
  id: string;
  /** @format uuid */
  organizationId: string;
  name: string;
  description: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  referrerUrls: string[];
  apiKey: string;
  tools: ApiTool[];
  organization: ApiOrganization;
}

export interface ApiCreateProjectDto {
  name: string;
  description: string;
  /** @minItems 1 */
  referrerUrls: string[];
  /** @format uuid */
  organizationId: string;
}

export interface ApiUpdateProjectDto {
  name?: string;
  description?: string;
  /** @minItems 1 */
  referrerUrls?: string[];
}

export interface ApiFullOrganization {
  /** @format uuid */
  id: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  memberships: ApiMembership[];
  projects: ApiProject[];
}

export interface ApiCreateOrganizationDto {
  name: string;
}

export interface ApiUpdateOrganizationDto {
  name?: string;
}

export interface ApiInvite {
  /** @format email */
  email: string;
  /** @format uuid */
  organizationId: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  expiresAt: string;
  organizationName: string;
  role: ApiMembershipRole;
}

export interface ApiCreateInviteDto {
  /** @format email */
  email: string;
  /** @example "Admin" */
  role: ApiMembershipRole;
}

export interface ApiRevokeInviteDto {
  /** @format email */
  email: string;
}
