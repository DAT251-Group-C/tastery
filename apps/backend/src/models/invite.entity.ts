import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, EntitySchema, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import OrganizationEntity from './organization.entity';

@Entity({
  name: 'invites',
})
export class InviteEntity extends EntitySchema {
  @ApiProperty()
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @ApiProperty()
  @PrimaryColumn('uuid')
  organizationId: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: string;

  @Exclude()
  @Column({
    type: 'text',
    unique: true,
  })
  hash: string;

  @ApiProperty()
  @Expose()
  get expiresAt() {
    const date = new Date(this.createdAt);
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  }

  @ApiProperty()
  @Expose()
  get organizationName() {
    return this.organization.name;
  }

  @Exclude()
  @ManyToOne(() => OrganizationEntity, organization => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;
}
