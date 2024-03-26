import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, Entity, EntitySchema, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import OrganizationEntity from './organization.entity';
import UserEntity from './user.entity';

@Entity({
  name: 'memberships',
})
export default class MembershipEntity extends EntitySchema {
  @PrimaryColumn({ type: 'uuid' })
  organizationId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @PrimaryColumn({ type: 'boolean', default: false })
  isOwner: boolean;

  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<OrganizationEntity>;

  @ManyToOne(() => UserEntity, user => user.id, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: string;
}
