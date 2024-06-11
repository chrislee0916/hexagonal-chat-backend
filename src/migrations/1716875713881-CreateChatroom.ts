import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatroom1716875713881 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "chatrooms" (
              "id" SERIAL PRIMARY KEY,
              "name" VARCHAR NOT NULL,
              "created_at" timestamp with time zone DEFAULT now(),
              "updated_at" timestamp with time zone DEFAULT now(),
              "deleted_at" timestamp with time zone DEFAULT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "chatrooms"`);
  }
}
