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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

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

  @OneToMany(() => CredentialEntity, credential => credential.project)
  credentials: Promise<CredentialEntity[]>;

  @OneToMany(() => ToolEntity, tool => tool.project)
  tools: Promise<ToolEntity[]>;

  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Promise<OrganizationEntity>;
}
