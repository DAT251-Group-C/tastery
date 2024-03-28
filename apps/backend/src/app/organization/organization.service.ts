import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { MembershipEntity, OrganizationEntity } from '../../models';
import { MembershipRole } from '../../models/membership.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,
  ) {}

  public createOrganization(body: CreateOrganizationDto, userId: string): Observable<OrganizationEntity> {
    return from(
      this.organizationRepository.manager.transaction(async manager => {
        const organization = this.organizationRepository.create(body);

        const { raw } = await manager.insert(OrganizationEntity, organization);
        const createdOrganization = raw[0] as OrganizationEntity;
        await manager.insert(MembershipEntity, { userId, organizationId: createdOrganization.id, role: MembershipRole.OWNER });

        return createdOrganization;
      }),
    );
  }

  public getOrganizations(userId: string): Observable<OrganizationEntity[]> {
    return from(
      this.organizationRepository
        .createQueryBuilder('organization')
        .innerJoin('organization.memberships', 'membership')
        .where('membership.userId = :userId', { userId })
        .getMany(),
    );
  }

  public getOrganizationById(organizationId: string, userId: string): Observable<OrganizationEntity> {
    return from(
      this.organizationRepository
        .createQueryBuilder('organization')
        .innerJoin('organization.memberships', 'membership')
        .where('membership.userId = :userId', { userId })
        .where('organization.id = :id', { id: organizationId })
        .getOne(),
    ).pipe(
      map(organization => {
        if (!organization) {
          throw new ResourceNotFoundException(`Organization with id ${organizationId} not found`);
        }

        return organization;
      }),
    );
  }

  public updateOrganization(organizationId: string, userId: string, body: UpdateOrganizationDto): Observable<UpdateResult> {
    return this.userHasAccessToOrganization(organizationId, userId).pipe(
      tap(({ memberships }) => {
        const membership = memberships.find(membership => membership.userId === userId);

        if (!membership) {
          throw new ResourceNotFoundException('Membership not found');
        }

        if (![MembershipRole.OWNER, MembershipRole.ADMIN].includes(membership.role)) {
          throw new ResourcePermissionDeniedException('You do not have permission to delete this organization');
        }
      }),
      switchMap(({ id }) => this.organizationRepository.update({ id }, body)),
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Organization with id ${organizationId} not found`);
        }
      }),
    );
  }

  public deleteOrganization(organizationId: string, userId: string): Observable<DeleteResult> {
    return this.userHasAccessToOrganization(organizationId, userId).pipe(
      tap(({ memberships }) => {
        const ownerId = memberships.find(membership => membership.role === MembershipRole.OWNER)?.userId;

        if (ownerId !== userId) {
          throw new ResourcePermissionDeniedException('You do not have permission to delete this organization');
        }
      }),
      switchMap(({ id }) => this.organizationRepository.delete({ id })),
      tap((result: DeleteResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Organization with id ${organizationId} not found`);
        }
      }),
    );
  }

  public userHasAccessToOrganization(organizationId: string, userId: string): Observable<OrganizationEntity> {
    return from(
      this.organizationRepository
        .createQueryBuilder('organization')
        .innerJoin('organization.memberships', 'membership')
        .where('membership.userId = :userId', { userId })
        .andWhere('organization.id = :id', { id: organizationId })
        .getOne(),
    ).pipe(
      map(organization => {
        if (!organization) {
          throw new ResourceNotFoundException(`Organization with id ${organizationId} not found`);
        }

        return organization;
      }),
    );
  }
}
