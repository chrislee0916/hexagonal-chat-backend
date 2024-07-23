import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chatroom_id' })
  chatroomId: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column()
  image: string;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
