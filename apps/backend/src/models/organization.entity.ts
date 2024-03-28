import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, EntitySchema, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import MembershipEntity from './membership.entity';
import ProjectEntity from './project.entity';
import { InviteEntity } from './invite.entity';

@Entity({
  name: 'organizations',
})
export default class OrganizationEntity extends EntitySchema {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

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

  @ApiProperty()
  @OneToMany(() => MembershipEntity, membership => membership.organization, {
    eager: true,
    cascade: true,
  })
  memberships: MembershipEntity[];

  @ApiProperty()
  @OneToMany(() => InviteEntity, invite => invite.organization, {
    cascade: true,
  })
  invites: Promise<InviteEntity[]>;

  @ApiProperty()
  @OneToMany(() => ProjectEntity, project => project.organization)
  projects: ProjectEntity[];
}
