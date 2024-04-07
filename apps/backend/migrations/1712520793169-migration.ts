import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712520793169 implements MigrationInterface {
  name = 'Migration1712520793169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying(255) NOT NULL DEFAULT '', "name" character varying(255) NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "description" character varying(255) NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "tags" text NOT NULL DEFAULT '[]', "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ingredient_unit" AS ENUM('g', 'kg', 'ml', 'l', 'unit', 'tsp', 'tbsp', 'clove', 'pinch', 'slice')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ean" character varying NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "image" character varying(2083), "recipeId" uuid NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "unit" "public"."ingredient_unit" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_b55414f4f386f632ce202709cf5" PRIMARY KEY ("id", "recipeId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" ADD CONSTRAINT "FK_f20a9542c7a02105fa40a08d95b" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_f20a9542c7a02105fa40a08d95b"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
    await queryRunner.query(`DROP TYPE "public"."ingredient_unit"`);
    await queryRunner.query(`DROP TABLE "recipes"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
