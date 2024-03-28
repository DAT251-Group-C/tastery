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
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiUpdateUserDto {
  name?: string;
  avatar?: string;
}

export interface ApiMembership {
  organizationId: string;
  userId: string;
  role: ApiMembershipRoleEnum;
  createdAt: string;
  updatedAt: string;
}

export interface ApiFullOrganization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  memberships: ApiMembership[];
  projects: any[][];
}

export interface ApiCreateOrganizationDto {
  name: string;
}

export interface ApiUpdateOrganizationDto {
  name?: string;
}

export interface ApiCreateProjectDto {
  name: string;
}

export interface ApiInvite {
  email: string;
  organizationId: string;
  createdAt: string;
  expiresAt: string;
  organizationName: string;
}

export interface ApiCredential {
  id: string;
  projectId: string;
  name: string;
  /** @minItems 1 */
  referrerUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiProject {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiFullCredential {
  id: string;
  projectId: string;
  name: string;
  /** @minItems 1 */
  referrerUrls: string[];
  createdAt: string;
  updatedAt: string;
  project: ApiProject;
}

export interface ApiFullMembership {
  organizationId: string;
  userId: string;
  role: ApiFullMembershipRoleEnum;
  createdAt: string;
  updatedAt: string;
  organization: object;
  user: ApiUser;
}

export interface ApiOrganization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTool {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parameters: object;
}

export interface ApiFullProject {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  credentials: any[][];
  tools: ApiTool[];
  organization: ApiOrganization;
}

export interface ApiFullTool {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parameters: object;
  project: object;
}

export enum ApiMembershipRoleEnum {
  Owner = 'owner',
  Admin = 'admin',
  User = 'user',
}

export enum ApiFullMembershipRoleEnum {
  Owner = 'owner',
  Admin = 'admin',
  User = 'user',
}
