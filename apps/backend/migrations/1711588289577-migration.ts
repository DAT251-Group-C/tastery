import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711588289577 implements MigrationInterface {
  name = 'Migration1711588289577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."memberships_role_enum" AS ENUM('admin', 'user')`);
    await queryRunner.query(`ALTER TABLE "memberships" ADD "role" "public"."memberships_role_enum" NOT NULL DEFAULT 'user'`);
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_50b1e96c97fc21dbbf014a03cb9"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_f3fde1e6f61514bc2c9031b8100" PRIMARY KEY ("organizationId", "userId", "isOwner", "role")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_f3fde1e6f61514bc2c9031b8100"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_50b1e96c97fc21dbbf014a03cb9" PRIMARY KEY ("organizationId", "userId", "isOwner")`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."memberships_role_enum"`);
  }
}
