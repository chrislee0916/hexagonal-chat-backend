import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1715577687249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
              "id" SERIAL PRIMARY KEY,
              "name" VARCHAR NOT NULL,
              "email" VARCHAR NOT NULL UNIQUE,
              "password" VARCHAR NOT NULL,
              "created_at" timestamp with time zone DEFAULT now(),
              "updated_at" timestamp with time zone DEFAULT now(),
              "deleted_at" timestamp with time zone DEFAULT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
