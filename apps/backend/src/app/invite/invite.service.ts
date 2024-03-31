import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { EmailService } from '../../common/email/email.service';
import { EncryptionService } from '../../common/encrypt/encryption.service';
import InvalidRequestException from '../../common/exceptions/invalid-request.exception';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import { MembershipRole } from '../../common/models/membership.model';
import { InviteEntity, MembershipEntity } from '../../entities';
import { OrganizationService } from '../organization/organization.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    private readonly organizationService: OrganizationService,
    private readonly encryptionService: EncryptionService,
    private readonly emailService: EmailService,
  ) {}

  public createInvite(userId: string, dto: CreateInviteDto, organizationId: string): Observable<InviteEntity> {
    if (dto.role === MembershipRole.OWNER) {
      throw new InvalidRequestException('You cannot invite users with owner role');
    }

    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(() =>
        this.membershipRepository
          .createQueryBuilder('membership')
          .innerJoin('membership.organization', 'organization')
          .innerJoin('membership.user', 'user')
          .where('user.email = :email', { email: dto.email })
          .andWhere('organization.id = :organizationId', { organizationId })
          .getExists(),
      ),
      tap(exists => {
        if (exists) {
          throw new ResourceExistsException(`User with email ${dto.email} is already a member of the organization`);
        }
      }),
      map(() => this.encryptionService.hashWithCrypto(dto.email + organizationId)),
      switchMap(hash => from(this.inviteRepository.findOne({ where: { hash } })).pipe(map(invite => ({ hash, invite })))),
      tap(({ invite }) => {
        if (invite) {
          throw new ResourceExistsException(`Invite for user with email ${dto.email} already exists`);
        }
      }),
      switchMap(({ hash }) =>
        from(
          this.inviteRepository.save(
            this.inviteRepository.create({
              email: dto.email,
              role: dto.role,
              organizationId,
              hash,
            }),
          ),
        ).pipe(
          switchMap(() => this.getInviteByHash(hash)),
          switchMap(invite => this.emailService.sendInvite(invite, hash)),
        ),
      ),
    );
  }

  public acceptInvite(userId: string, userEmail: string, organizationId: string): Observable<void> {
    return this.getInvite(userEmail, organizationId).pipe(
      switchMap(invite =>
        from(
          this.membershipRepository.save(
            this.membershipRepository.create({
              userId,
              role: invite.role,
              organizationId: invite.organizationId,
            }),
          ),
        ),
      ),
      switchMap(() => from(this.inviteRepository.delete({ email: userEmail, organizationId }))),
      map(() => undefined),
    );
  }

  public getInviteByHash(hash: string): Observable<InviteEntity> {
    return from(this.inviteRepository.findOne({ where: { hash } })).pipe(
      map(invite => {
        if (!invite) {
          throw new ResourceNotFoundException('Invite not found by hash');
        }

        return invite;
      }),
      tap(invite => {
        const expiresAt = invite.expiresAt;

        if (new Date(expiresAt) < new Date()) {
          throw new ResourceNotFoundException('Invite has expired');
        }
      }),
    );
  }

  public getInvite(email: string, organizationId: string): Observable<InviteEntity> {
    return from(this.inviteRepository.findOne({ where: { email, organizationId } })).pipe(
      map(invite => {
        if (!invite) {
          throw new ResourceNotFoundException('Invite not found');
        }

        return invite;
      }),
      tap(invite => {
        const expiresAt = invite.expiresAt;

        if (new Date(expiresAt) < new Date()) {
          throw new ResourceNotFoundException('Invite has expired');
        }
      }),
    );
  }

  public getInvites(email: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<InviteEntity>> {
    const query = this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.organization', 'organization')
      .where('invite.email = :email', { email })
      .orderBy('invite.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, invites]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(invites, pageMetaDto);
      }),
    );
  }

  public getOrganizationInvites(organizationId: string, userId: string, pageOptionsDto: PageOptionsDto): Observable<PageDto<InviteEntity>> {
    const query = this.inviteRepository
      .createQueryBuilder('invite')
      .leftJoinAndSelect('invite.organization', 'organization')
      .innerJoin('organization.memberships', 'membership')
      .where('membership.userId = :userId', { userId })
      .andWhere('organization.id = :id', { id: organizationId })
      .orderBy('invite.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    return combineLatest([query.getCount(), query.getMany()]).pipe(
      map(([itemCount, invites]) => {
        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(invites, pageMetaDto);
      }),
    );
  }

  public revokeInvite(organizationId: string, userId: string, email: string): Observable<DeleteResult> {
    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(() =>
        from(
          this.inviteRepository.delete({
            email,
            organizationId,
          }),
        ),
      ),
      tap(({ affected }) => {
        if (!affected) {
          throw new ResourceNotFoundException('Could not find invite to revoke');
        }
      }),
    );
  }

  public declineInvite(email: string, organizationId: string): Observable<DeleteResult> {
    return from(this.inviteRepository.delete({ email, organizationId })).pipe(
      tap(({ affected }) => {
        if (!affected) {
          throw new ResourceNotFoundException('Could not find invite to decline');
        }
      }),
    );
  }
}
