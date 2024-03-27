import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import CredentialEntity from './credential.entity';
import OrganizationEntity from './organization.entity';
import ToolEntity from './tool.entity';

@Entity({
  name: 'projects',
})
export default class ProjectEntity extends EntitySchema {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  organizationId: string;

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
  @OneToMany(() => CredentialEntity, credential => credential.project)
  credentials: CredentialEntity[];

  @ApiProperty()
  @OneToMany(() => ToolEntity, tool => tool.project)
  tools: ToolEntity[];

  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<OrganizationEntity>;
}
