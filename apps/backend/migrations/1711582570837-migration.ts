import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711582570837 implements MigrationInterface {
  name = 'Migration1711582570837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invites" ("email" character varying(255) NOT NULL, "organizationId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "hash" text NOT NULL, CONSTRAINT "UQ_440d1700645f16ca5bcff3e873b" UNIQUE ("hash"), CONSTRAINT "PK_fc817ac0312e16bfebb0f360c3a" PRIMARY KEY ("email", "organizationId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_9e65b4b3671b77f577afc2a71f1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites" DROP CONSTRAINT "FK_9e65b4b3671b77f577afc2a71f1"`);
    await queryRunner.query(`DROP TABLE "invites"`);
  }
}
