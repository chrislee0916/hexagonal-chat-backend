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

  // @ManyToMany(() => UserEntity, (user) => user.askedFriends)
  // @JoinTable({
  //   name: 'user_friend',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
  // })
  // askFriends: UserEntity[];

  // @ManyToMany(() => UserEntity, (user) => user.askFriends)
  // askedFriends: UserEntity[];

  askFriends: Pick<UserEntity, 'id' | 'name' | 'email' | 'image'>[];

  friends: Pick<UserEntity, 'id' | 'name' | 'email' | 'image'>[];

  @ManyToMany(() => ChatroomEntity)
  @JoinTable({
    name: 'chatroom_user',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
  })
  chatrooms: Pick<ChatroomEntity, 'id' | 'name'>[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
