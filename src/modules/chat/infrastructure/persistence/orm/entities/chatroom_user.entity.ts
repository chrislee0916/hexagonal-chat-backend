import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chatroom_user')
export class ChatroomUserEntity {
  @PrimaryColumn({ name: 'chatroom_id' })
  chatroomId: number;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'joined_at', type: 'timestamptz' })
  joinedAt: Date;

  @DeleteDateColumn({ name: 'left_at', type: 'timestamptz' })
  leftAt: Date;
}
