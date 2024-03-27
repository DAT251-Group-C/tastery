import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ProjectEntity from './project.entity';

@Entity({
  name: 'credentials',
})
export default class CredentialEntity extends EntitySchema {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('uuid')
  projectId: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @Column('simple-array')
  referrerUrls: string[];

  @ManyToOne(() => ProjectEntity, project => project.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Promise<ProjectEntity>;

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

  @BeforeInsert()
  @BeforeUpdate()
  ensureReferrerUrlsNotEmpty() {
    if (!this.referrerUrls || this.referrerUrls.length === 0) {
      throw new Error('Credentials error: Referrer URLs cannot be empty');
    }
  }
}
