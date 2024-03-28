import { CreateDateColumn, Entity, EntitySchema, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import OrganizationEntity from './organization.entity';
import UserEntity from './user.entity';
import { MembershipRole } from '../common/models/membership.model';

@Entity({
  name: 'memberships',
})
export default class MembershipEntity extends EntitySchema {
  @PrimaryColumn({ type: 'uuid' })
  organizationId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @PrimaryColumn({ type: 'enum', enum: MembershipRole, default: MembershipRole.USER })
  role: MembershipRole;

  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<OrganizationEntity>;

  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<UserEntity>;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;
}
