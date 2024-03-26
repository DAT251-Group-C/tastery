import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711486680115 implements MigrationInterface {
  name = 'Migration1711486680115';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" ADD "isOwner" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_64893eb3c6fcaeaaee71a4d0ae1"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_50b1e96c97fc21dbbf014a03cb9" PRIMARY KEY ("organizationId", "userId", "isOwner")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_50b1e96c97fc21dbbf014a03cb9"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_64893eb3c6fcaeaaee71a4d0ae1" PRIMARY KEY ("organizationId", "userId")`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "isOwner"`);
  }
}
