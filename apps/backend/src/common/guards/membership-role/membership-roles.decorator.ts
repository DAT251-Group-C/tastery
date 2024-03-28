import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '../../../entities/membership.entity';

export const MEMBERSHIP_ROLES_KEY = 'membership_roles' as const;

export type MembershipRoleFetchType = 'params' | 'header' | 'query' | 'body';
export type MembershipRolesData = {
  roles: MembershipRole[];
  fetchType: MembershipRoleFetchType;
  key: string;
};

export const MembershipRoles = (roles: MembershipRole[] = [], fetchType: MembershipRoleFetchType = 'params', key = 'organizationId') =>
  SetMetadata<typeof MEMBERSHIP_ROLES_KEY, MembershipRolesData>(MEMBERSHIP_ROLES_KEY, { roles, fetchType, key });
