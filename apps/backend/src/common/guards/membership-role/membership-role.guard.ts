import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { MembershipService } from '../../../app/membership/membership.service';
import { AuthGuard } from '../auth/auth.guard';
import { MEMBERSHIP_ROLES_KEY, MembershipRolesData } from './membership-roles.decorator';

@Injectable()
export class MembershipRoleGuard implements CanActivate {
  constructor(
    private authGuard: AuthGuard,
    private reflector: Reflector,
    private membershipService: MembershipService,
  ) {}

  public canActivate(context: ExecutionContext): Observable<boolean> {
    const data = this.reflector.getAllAndOverride<MembershipRolesData>(MEMBERSHIP_ROLES_KEY, [context.getHandler(), context.getClass()]);

    return this.authGuard.getAccessTokenFromRequest(context).pipe(
      map(accessToken => {
        const request = context.switchToHttp().getRequest();
        const organizationId: string = request[data.fetchType][data.key];

        if (!organizationId) {
          throw new BadRequestException('Organization ID is required');
        }

        return { userId: accessToken.sub, organizationId };
      }),
      switchMap(({ userId, organizationId }) =>
        this.membershipService.getMembership(organizationId, userId).pipe(
          catchError(() =>
            throwError(() => {
              return new NotFoundException('Membership not found');
            }),
          ),
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
}
