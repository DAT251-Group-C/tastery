import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712416339779 implements MigrationInterface {
  name = 'Migration1712416339779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "recipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "description" character varying(255) NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "tags" text NOT NULL DEFAULT '[]', "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_0adc32cfd88d0c67cf223a18794" PRIMARY KEY ("id", "userId"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."ingredient_unit" AS ENUM('g', 'kg', 'ml', 'l')`);
    await queryRunner.query(
      `CREATE TABLE "ingredients" ("ean" character varying NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "image" character varying(2083), "recipeId" uuid NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "unit" "public"."ingredient_unit" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_89a8c3c5bfd7bb91fa5717c7fb5" PRIMARY KEY ("ean", "recipeId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" ADD CONSTRAINT "FK_519e426f525969e7088777249cd" FOREIGN KEY ("recipeId", "recipeId") REFERENCES "recipes"("id","userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_519e426f525969e7088777249cd"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0"`);
    await queryRunner.query(`DROP TABLE "ingredients"`);
    await queryRunner.query(`DROP TYPE "public"."ingredient_unit"`);
    await queryRunner.query(`DROP TABLE "recipes"`);
  }
}
