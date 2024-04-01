import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711973528591 implements MigrationInterface {
  name = 'Migration1711973528591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "apiKey" character varying(24) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_abfe2253f0a1eece8ef441dd142" UNIQUE ("apiKey")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_abfe2253f0a1eece8ef441dd142"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "apiKey"`);
  }
}
