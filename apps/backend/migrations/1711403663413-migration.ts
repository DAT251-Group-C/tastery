import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711403663413 implements MigrationInterface {
  name = 'Migration1711403663413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tools" ADD "parameters" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tools" DROP COLUMN "parameters"`);
  }
}
