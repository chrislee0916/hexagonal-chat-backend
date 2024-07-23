import { ChatroomEntity } from '../../../../../chat/infrastructure/persistence/orm/entities/chatroom.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  askFriends: Pick<
    UserEntity,
    'id' | 'name' | 'email' | 'image' | 'updatedAt'
  >[];

  friends: Pick<UserEntity, 'id' | 'name' | 'email' | 'image' | 'updatedAt'>[];

  @ManyToMany(() => ChatroomEntity)
  @JoinTable({
    name: 'chatroom_user',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
  })
  chatrooms: Pick<ChatroomEntity, 'id' | 'name' | 'image'>[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
