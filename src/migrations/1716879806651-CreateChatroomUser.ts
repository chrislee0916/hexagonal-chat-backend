import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatroomUser1716879806651 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "chatroom_user" (
            "chatroom_id" INTEGER NOT NULL,
            "user_id" INTEGER NOT NULL,
            "joined_at" timestamp with time zone DEFAULT now(),
            "left_at" timestamp with time zone DEFAULT NULL,
            PRIMARY KEY (user_id, chatroom_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (chatroom_id) REFERENCES chatrooms(id) ON DELETE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_friend"`);
  }
}
