import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { MembershipRole } from '../../common/models/membership.model';
import { MembershipEntity } from '../../entities';
import { OrganizationService } from '../organization/organization.service';
import { UpdateMembershipRoleDto } from './dto/update-membership-role.dto';

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

  public getMemberships(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<MembershipEntity>> {
    const query = this.membershipRepository
      .createQueryBuilder('membership')
      .where('membership.userId = :userId', { userId })
      .orderBy('membership.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, memberships]) => {
        return new PageDto(memberships, new PageMetaDto({ itemCount, pageOptionsDto }));
      }),
    );
  }

  public getMembershipsInOrganization(
    organizationId: string,
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Observable<PageDto<MembershipEntity>> {
    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(() => {
        const query = this.membershipRepository
          .createQueryBuilder('membership')
          .where('membership.organizationId = :organizationId', { organizationId })
          .orderBy('membership.createdAt', pageOptionsDto.order)
          .skip(pageOptionsDto.skip)
          .take(pageOptionsDto.take);

        return combineLatest([query.getCount(), query.getMany()]).pipe(
          map(([itemCount, memberships]) => {
            return new PageDto(memberships, new PageMetaDto({ itemCount, pageOptionsDto }));
          }),
        );
      }),
    );
  }

  public updateMembershipRole(organizationId: string, userId: string, data: UpdateMembershipRoleDto): Observable<void> {
    if (userId === data.userId) {
      throw new ResourcePermissionDeniedException('You cannot update your own role');
    }

    return combineLatest([this.getMembership(organizationId, userId), this.getMembership(organizationId, data.userId)]).pipe(
      tap(([userMembership, userToUpdateMembership]) => {
        if (userMembership.role !== MembershipRole.OWNER) {
          throw new ResourcePermissionDeniedException('Only the organization owner can update roles');
        }

        if (userToUpdateMembership.role === data.role) {
          throw new ResourceExistsException('User already has this role');
        }
      }),
      switchMap(([userMembership, userToUpdateMembership]) => {
        if (data.role === MembershipRole.OWNER) {
          return this.membershipRepository.manager.transaction(async manager => {
            await manager.update(MembershipEntity, { organizationId, userId: userMembership.userId }, { role: MembershipRole.ADMIN });
            await manager.update(
              MembershipEntity,
              { organizationId, userId: userToUpdateMembership.userId },
              { role: MembershipRole.OWNER },
            );
          });
        } else {
          return this.membershipRepository.update({ organizationId, userId: userToUpdateMembership.userId }, { role: data.role });
        }
      }),
      map(() => undefined),
    );
  }

  public removeMembership(userId: string, userIdToRemove: string, organizationId: string): Observable<DeleteResult> {
    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(organization => from(organization.memberships)),
      tap(memberships => {
        const userMembership = memberships.find(membership => membership.userId === userId);
        const userToRemoveMembership = memberships.find(membership => membership.userId === userId);

        if (!userMembership || !userToRemoveMembership) {
          throw new ResourceNotFoundException('Membership not found');
        }

        if (![MembershipRole.OWNER, MembershipRole.ADMIN].includes(userMembership.role) && userId !== userIdToRemove) {
          throw new ResourcePermissionDeniedException('Only the owner and admins can remove other members');
        }

        if (userMembership.role === MembershipRole.OWNER && userId === userIdToRemove) {
          throw new ResourcePermissionDeniedException(
            'Your organization needs an owner! Transfer the ownership or delete the organization',
          );
        }

        if (userToRemoveMembership.role === MembershipRole.OWNER) {
          throw new ResourcePermissionDeniedException('Organization owner cannot be removed. Are you trying to start a coup?');
        }
      }),
      switchMap(() => from(this.membershipRepository.delete({ organizationId, userId: userIdToRemove }))),
    );
  }
}
