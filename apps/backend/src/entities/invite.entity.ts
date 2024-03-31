import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, EntitySchema, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MembershipRole } from '../common/models/membership.model';
import OrganizationEntity from './organization.entity';

@Entity({
  name: 'invites',
})
export class InviteEntity extends EntitySchema {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @PrimaryColumn('uuid')
  organizationId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;

  @PrimaryColumn({ type: 'enum', enum: MembershipRole, enumName: 'MembershipRole', default: MembershipRole.USER })
  role: MembershipRole;

  @Exclude()
  @Column({
    type: 'text',
    unique: true,
  })
  hash: string;

  @Expose()
  get expiresAt() {
    const date = new Date(this.createdAt);
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  }

  @Expose()
  get organizationName() {
    return this.organization.name;
  }

  @Exclude()
  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;
}
