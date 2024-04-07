import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712521270283 implements MigrationInterface {
  name = 'Migration1712521270283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" ADD "instructions" character varying(2083) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "instructions"`);
  }
}
