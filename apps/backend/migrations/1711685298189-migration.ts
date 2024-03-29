import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711685298189 implements MigrationInterface {
  name = 'Migration1711685298189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "emailVerified" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
  }
}
