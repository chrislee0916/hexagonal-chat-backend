import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserFriend1716349920966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_friend" (
              "user_id" INTEGER NOT NULL,
              "friend_id" INTEGER NOT NULL,
              "status" VARCHAR NOT NULL DEFAULT 'pending',
              "created_at" timestamp with time zone DEFAULT now(),
              "updated_at" timestamp with time zone DEFAULT now(),
              "deleted_at" timestamp with time zone DEFAULT NULL,
              PRIMARY KEY (user_id, friend_id),
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_friend"`);
  }
}
