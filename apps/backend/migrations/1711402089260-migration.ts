import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1711402089260 implements MigrationInterface {
  name = 'Migration1711402089260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_693d053d2009de2741907423e18"`);
    await queryRunner.query(`ALTER TABLE "credentials" RENAME COLUMN "organizationId" TO "projectId"`);
    await queryRunner.query(
      `CREATE TABLE "tool_parameter" ("name" character varying NOT NULL, "toolId" uuid NOT NULL, "description" character varying(255) NOT NULL DEFAULT '', CONSTRAINT "PK_9610611243d638cc3041cbc6ec0" PRIMARY KEY ("name", "toolId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tools" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "description" character varying(255) NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_e23d56734caad471277bad8bf85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "name" character varying(255) NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tool_parameter" ADD CONSTRAINT "FK_467b86bc8fbe049e5e308b3cc44" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tools" ADD CONSTRAINT "FK_881ac9ca750cd12db201ef0bc9b" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "credentials" ADD CONSTRAINT "FK_17af087e46e3a268badb43ab315" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_17af087e46e3a268badb43ab315"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6"`);
    await queryRunner.query(`ALTER TABLE "tools" DROP CONSTRAINT "FK_881ac9ca750cd12db201ef0bc9b"`);
    await queryRunner.query(`ALTER TABLE "tool_parameter" DROP CONSTRAINT "FK_467b86bc8fbe049e5e308b3cc44"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "tools"`);
    await queryRunner.query(`DROP TABLE "tool_parameter"`);
    await queryRunner.query(`ALTER TABLE "credentials" RENAME COLUMN "projectId" TO "organizationId"`);
    await queryRunner.query(
      `ALTER TABLE "credentials" ADD CONSTRAINT "FK_693d053d2009de2741907423e18" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
