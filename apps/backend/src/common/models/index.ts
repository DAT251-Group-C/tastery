import { FullCredential } from './credential.model';
import { Invite } from './invite.model';
import { FullMembership, Membership } from './membership.model';
import { FullOrganization, Organization } from './organization.model';
import { FullProject, Project } from './project.model';
import { FullTool, Tool } from './tool.model';
import { User } from './user.model';
import { Credential } from './credential.model';

const models = [
  User,
  Invite,
  Credential,
  FullCredential,
  Membership,
  FullMembership,
  Organization,
  FullOrganization,
  Project,
  FullProject,
  Tool,
  FullTool,
];

export {
  Credential,
  FullCredential,
  FullMembership,
  FullOrganization,
  FullProject,
  FullTool,
  Invite,
  Membership,
  Organization,
  Project,
  Tool,
  User,
};
export default models;
