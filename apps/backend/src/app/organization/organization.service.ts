import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { MembershipEntity, OrganizationEntity } from '../../entities';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { MembershipRole } from '../../common/models/membership.model';

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

        const { generatedMaps } = await manager.insert(OrganizationEntity, organization);
        const { id } = generatedMaps[0] as OrganizationEntity;
        await manager.insert(MembershipEntity, { userId, organizationId: id, role: MembershipRole.OWNER });
        return manager.findOneByOrFail(OrganizationEntity, { id });
      }),
    );
  }

  public getOrganizations(userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<OrganizationEntity>> {
    const query = this.organizationRepository
      .createQueryBuilder('organization')
      .innerJoin('organization.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .orderBy('organization.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, organizations]) => {
        return new PageDto(organizations, new PageMetaDto({ itemCount, pageOptionsDto }));
      }),
    );
  }

  public getOrganizationById(organizationId: string, userId: string): Observable<OrganizationEntity> {
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

  public updateOrganization(organizationId: string, userId: string, body: UpdateOrganizationDto): Observable<UpdateResult> {
    return this.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(async organization => {
        const membership = (await organization.memberships).find(membership => membership.userId === userId);

        if (!membership) {
          throw new ResourceNotFoundException('Membership not found');
        }

        if (![MembershipRole.OWNER, MembershipRole.ADMIN].includes(membership.role)) {
          throw new ResourcePermissionDeniedException('You do not have permission to delete this organization');
        }

        return await this.organizationRepository.update({ id: organizationId }, body);
      }),
      tap((result: UpdateResult) => {
        if (result.affected === 0) {
          throw new ResourceNotFoundException(`Organization with id ${organizationId} not found`);
        }
      }),
    );
  }

  public deleteOrganization(organizationId: string, userId: string): Observable<DeleteResult> {
    return this.userHasAccessToOrganization(organizationId, userId).pipe(
      tap(async ({ memberships }) => {
        const ownerId = (await memberships).find(membership => membership.role === MembershipRole.OWNER)?.userId;

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
