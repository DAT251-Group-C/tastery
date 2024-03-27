import { EntitySchema } from 'typeorm';
import CredentialEntity from './credential.entity';
import { InviteEntity } from './invite.entity';
import MembershipEntity from './membership.entity';
import OrganizationEntity from './organization.entity';
import ProjectEntity from './project.entity';
import ToolEntity from './tool.entity';
import UserEntity from './user.entity';

const entities: Array<typeof EntitySchema> = [
  UserEntity,
  OrganizationEntity,
  MembershipEntity,
  CredentialEntity,
  ProjectEntity,
  ToolEntity,
  InviteEntity,
];

export { CredentialEntity, InviteEntity, MembershipEntity, OrganizationEntity, ProjectEntity, ToolEntity, UserEntity };
export default entities;
