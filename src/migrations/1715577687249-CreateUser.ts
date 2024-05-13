import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1715577687249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
              "id" SERIAL PRIMARY KEY,
              "email" VARCHAR NOT NULL UNIQUE,
              "password" VARCHAR NOT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
