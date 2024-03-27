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

export interface ApiUserEntity {
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

export interface ApiOrganizationEntity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  memberships: string[];
  projects: string[];
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

export interface ApiMembershipEntity {
  createdAt: string;
  updatedAt: string;
}

export interface ApiCredentialEntity {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProjectEntity {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  credentials: string[];
  tools: string[];
}

export interface ApiToolEntity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
