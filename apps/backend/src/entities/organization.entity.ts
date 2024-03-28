import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, EntitySchema, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { InviteEntity } from './invite.entity';
import MembershipEntity from './membership.entity';
import ProjectEntity from './project.entity';

@Entity({
  name: 'organizations',
})
export default class OrganizationEntity extends EntitySchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

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

  @OneToMany(() => MembershipEntity, membership => membership.organization, {
    cascade: true,
  })
  memberships: Promise<MembershipEntity[]>;

  @OneToMany(() => InviteEntity, invite => invite.organization, {
    cascade: true,
  })
  invites: Promise<InviteEntity[]>;

  @OneToMany(() => ProjectEntity, project => project.organization)
  projects: Promise<ProjectEntity[]>;
}
