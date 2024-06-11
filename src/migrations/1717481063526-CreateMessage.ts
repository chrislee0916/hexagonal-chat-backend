import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessage1717481063526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "messages" (
                "id" SERIAL PRIMARY KEY,
                "chatroom_id" INTEGER NOT NULL,
                "sender_id" INTEGER NOT NULL,
                "content" TEXT NOT NULL,
                "created_at" timestamp with time zone DEFAULT now(),
                FOREIGN KEY (chatroom_id) REFERENCES chatrooms(id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
    await queryRunner.query(`CREATE INDEX ON messages (chatroom_id)`);
    await queryRunner.query(`CREATE INDEX ON messages (sender_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
  }
}
