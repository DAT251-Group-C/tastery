import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711686118958 implements MigrationInterface {
  name = 'Migration1711686118958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "emailVerified" TIMESTAMP WITH TIME ZONE`);
  }
}
