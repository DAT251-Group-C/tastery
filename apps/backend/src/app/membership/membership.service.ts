import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { MembershipEntity } from '../../entities';
import { MembershipRole } from '../../entities/membership.entity';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    private readonly organizationService: OrganizationService,
  ) {}

  public getMembership(organizationId: string, userId: string): Observable<MembershipEntity> {
    return from(this.membershipRepository.findOne({ where: { organizationId, userId } })).pipe(
      map(membership => {
        if (!membership) {
          throw new ResourceNotFoundException('Membership not found');
        }

        return membership;
      }),
    );
  }

  public getMemberships(userId: string): Observable<MembershipEntity[]> {
    return from(this.membershipRepository.find({ where: { userId } }));
  }

  public removeMembership(userId: string, userIdToRemove: string, organizationId: string): Observable<DeleteResult> {
    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(organization => from(organization.memberships)),
      tap(memberships => {
        const userMembership = memberships.find(membership => membership.userId === userId);
        const userToRemoveMembership = memberships.find(membership => membership.userId === userId);

        if (!userMembership || userToRemoveMembership) {
          throw new ResourceNotFoundException('Membership not found');
        }

        if (![MembershipRole.OWNER, MembershipRole.ADMIN].includes(userMembership.role) && userId !== userIdToRemove) {
          throw new ResourcePermissionDeniedException('You do not have permission to remove this user');
        }
      }),
      switchMap(() => from(this.membershipRepository.delete({ organizationId, userId: userIdToRemove }))),
    );
  }
}
