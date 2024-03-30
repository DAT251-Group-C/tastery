import { Credential } from './credential.model';
import { FullCredential } from './full-credential.model';
import { FullMembership } from './full-membership.model';
import { FullOrganization } from './full-organization.model';
import { FullProject } from './full-project.model';
import { Invite } from './invite.model';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Project } from './project.model';
import { FullTool, Tool } from './tool.model';
import { User } from './user.model';

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
