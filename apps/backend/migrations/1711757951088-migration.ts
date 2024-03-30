import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711757951088 implements MigrationInterface {
  name = 'Migration1711757951088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "description" character varying(255) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "description"`);
  }
}
