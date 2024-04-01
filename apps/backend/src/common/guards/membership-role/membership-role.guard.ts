import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { MembershipService } from '../../../app/membership/membership.service';
import { ProjectService } from '../../../app/project/project.service';
import { MembershipEntity } from '../../../entities';
import { IAccessToken } from '../../decorators/access-token.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { MEMBERSHIP_ROLES_KEY, MembershipRolesData } from './membership-roles.decorator';

@Injectable()
export class MembershipRoleGuard implements CanActivate {
  constructor(
    private authGuard: AuthGuard,
    private reflector: Reflector,
    private membershipService: MembershipService,
    private projectService: ProjectService,
  ) {}

  public canActivate(context: ExecutionContext): Observable<boolean> {
    const data = this.reflector.getAllAndOverride<MembershipRolesData>(MEMBERSHIP_ROLES_KEY, [context.getHandler(), context.getClass()]);

    return this.authGuard.getAccessTokenFromRequest(context).pipe(
      switchMap(accessToken =>
        this.getMembership(context, accessToken).pipe(
          catchError(() => {
            throw new UnauthorizedException('You do not have permission to access this resource');
          }),
        ),
      ),
      map(membership => {
        if (!data.roles.includes(membership.role)) {
          throw new UnauthorizedException('You do not have permission to access this resource');
        }

        return true;
      }),
    );
  }

  private getMembership(context: ExecutionContext, accessToken: IAccessToken): Observable<MembershipEntity> {
    const data = this.reflector.getAllAndOverride<MembershipRolesData>(MEMBERSHIP_ROLES_KEY, [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();

    const organizationId = request[data.fetchType]['organizationId'];

    if (organizationId && typeof organizationId === 'string') {
      return this.membershipService.getMembership(organizationId, accessToken.sub);
    }

    const projectId = request[data.fetchType]['projectId'];
    if (projectId && typeof projectId === 'string') {
      return this.projectService
        .getProjectById(projectId, accessToken.sub)
        .pipe(switchMap(({ organizationId }) => this.membershipService.getMembership(organizationId, accessToken.sub)));
    }

    throw new Error('Neither an organization ID or project ID was supplied');
  }
}
