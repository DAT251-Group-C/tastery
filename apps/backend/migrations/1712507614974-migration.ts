import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1712507614974 implements MigrationInterface {
  name = 'Migration1712507614974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "FK_519e426f525969e7088777249cd"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0"`);
    await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "PK_0adc32cfd88d0c67cf223a18794"`);
    await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id")`);
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
    await queryRunner.query(`ALTER TABLE "recipes" DROP CONSTRAINT "PK_8f09680a51bf3669c1598a21682"`);
    await queryRunner.query(`ALTER TABLE "recipes" ADD CONSTRAINT "PK_0adc32cfd88d0c67cf223a18794" PRIMARY KEY ("id", "userId")`);
    await queryRunner.query(
      `ALTER TABLE "recipes" ADD CONSTRAINT "FK_ad4f881e4b9769d16c0ed2bb3f0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ingredients" ADD CONSTRAINT "FK_519e426f525969e7088777249cd" FOREIGN KEY ("recipeId", "recipeId") REFERENCES "recipes"("id","userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
