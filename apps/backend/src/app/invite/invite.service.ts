import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { EncryptionService } from '../../common/encrypt/encryption.service';
import ResourceExistsException from '../../common/exceptions/resource-exists.exception';
import ResourceNotFoundException from '../../common/exceptions/resource-not-found.exception';
import ResourcePermissionDeniedException from '../../common/exceptions/resource-permission-denied.exception';
import { InviteEntity, MembershipEntity } from '../../entities';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly inviteRepository: Repository<InviteEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    private readonly organizationService: OrganizationService,
    private readonly encryptionService: EncryptionService,
  ) {}

  public createInvite(userId: string, email: string, organizationId: string): Observable<InviteEntity> {
    return this.organizationService.userHasAccessToOrganization(organizationId, userId).pipe(
      switchMap(() =>
        this.membershipRepository
          .createQueryBuilder('membership')
          .innerJoin('membership.organizationId', 'organization')
          .innerJoin('membership.userId', 'user')
          .where('user.email = :email', { email })
          .andWhere('organization.id = :organizationId', { organizationId })
          .getExists(),
      ),
      tap(exists => {
        if (exists) {
          throw new ResourceExistsException(`User with email ${email} is already a member of the organization`);
        }
      }),
      map(() => this.encryptionService.hashWithCrypto(email + organizationId)),
      switchMap(hash => combineLatest([from(hash), from(this.inviteRepository.findOne({ where: { hash } }))])),
      map(([hash, invite]) => ({ hash, invite })),
      tap(({ invite }) => {
        if (invite) {
          throw new ResourceExistsException(`Invite for user with email ${email} already exists`);
        }
      }),
      switchMap(({ hash }) =>
        this.inviteRepository.save(
          this.inviteRepository.create({
            email,
            organizationId,
            hash,
          }),
        ),
      ),
      switchMap(invite => this.sendEmailInvite(invite)),
    );
  }

  public acceptInvite(userId: string, userEmail: string, hash: string): Observable<void> {
    return this.getInviteByHash(hash).pipe(
      tap(invite => {
        if (invite.email !== userEmail) {
          throw new ResourcePermissionDeniedException('Email does not match invite');
        }
      }),
      switchMap(invite =>
        from(
          this.membershipRepository.save(
            this.membershipRepository.create({
              userId,
              organizationId: invite.organizationId,
            }),
          ),
        ),
      ),
      switchMap(() => from(this.inviteRepository.delete({ hash }))),
      map(() => undefined),
    );
  }

  public getInviteByHash(hash: string): Observable<InviteEntity> {
    return from(this.inviteRepository.findOne({ where: { hash } })).pipe(
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

  public getInvites(email: string): Observable<InviteEntity[]> {
    return from(this.inviteRepository.find({ where: { email } }));
  }

  public getOrganizationInvites(organizationId: string, userId: string): Observable<InviteEntity[]> {
    return this.organizationService
      .userHasAccessToOrganization(organizationId, userId)
      .pipe(switchMap(() => from(this.inviteRepository.find({ where: { organizationId } }))));
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
          throw new ResourceNotFoundException('Invite not found');
        }
      }),
    );
  }

  public declineInvite(email: string, hash: string): Observable<DeleteResult> {
    return from(this.inviteRepository.delete({ email, hash })).pipe(
      tap(({ affected }) => {
        if (!affected) {
          throw new ResourceNotFoundException('Invite not found');
        }
      }),
    );
  }

  private sendEmailInvite(invite: InviteEntity): Observable<InviteEntity> {
    // TODO: Implement email sending

    return of(invite);
  }
}
