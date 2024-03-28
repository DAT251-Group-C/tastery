import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711588592561 implements MigrationInterface {
  name = 'Migration1711588592561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_f3fde1e6f61514bc2c9031b8100"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_bc1da0e9fa7bbb654b9475cd01f" PRIMARY KEY ("organizationId", "userId", "role")`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" DROP COLUMN "isOwner"`);
    await queryRunner.query(`ALTER TYPE "public"."memberships_role_enum" RENAME TO "memberships_role_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."memberships_role_enum" AS ENUM('owner', 'admin', 'user')`);
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "role" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ALTER COLUMN "role" TYPE "public"."memberships_role_enum" USING "role"::"text"::"public"."memberships_role_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'user'`);
    await queryRunner.query(`DROP TYPE "public"."memberships_role_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."memberships_role_enum_old" AS ENUM('admin', 'user')`);
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "role" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ALTER COLUMN "role" TYPE "public"."memberships_role_enum_old" USING "role"::"text"::"public"."memberships_role_enum_old"`,
    );
    await queryRunner.query(`ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'user'`);
    await queryRunner.query(`DROP TYPE "public"."memberships_role_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."memberships_role_enum_old" RENAME TO "memberships_role_enum"`);
    await queryRunner.query(`ALTER TABLE "memberships" ADD "isOwner" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "PK_bc1da0e9fa7bbb654b9475cd01f"`);
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "PK_f3fde1e6f61514bc2c9031b8100" PRIMARY KEY ("organizationId", "userId", "isOwner", "role")`,
    );
  }
}
