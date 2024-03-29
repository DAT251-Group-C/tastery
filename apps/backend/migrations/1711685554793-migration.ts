import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711685554793 implements MigrationInterface {
  name = 'Migration1711685554793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "emailVerified" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DEFAULT now()`);
  }
}
