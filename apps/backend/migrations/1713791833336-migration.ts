import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1713791833336 implements MigrationInterface {
  name = 'Migration1713791833336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_e747534006c6e3c2f09939da60f"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_13469711425f498cae5e6faa6a8"`);
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "recipeId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_e747534006c6e3c2f09939da60f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_13469711425f498cae5e6faa6a8" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_13469711425f498cae5e6faa6a8"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_e747534006c6e3c2f09939da60f"`);
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "recipeId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_13469711425f498cae5e6faa6a8" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_e747534006c6e3c2f09939da60f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
