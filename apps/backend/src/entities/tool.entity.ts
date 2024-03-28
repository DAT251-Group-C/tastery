import { JSONSchema7 } from 'json-schema';
import { Column, CreateDateColumn, Entity, EntitySchema, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import ProjectEntity from './project.entity';

@Entity({
  name: 'tools',
})
export default class ToolEntity extends EntitySchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  projectId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  description: string;

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

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, JSONSchema7>;

  @ManyToOne(() => ProjectEntity, project => project.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Promise<ProjectEntity>;
}
