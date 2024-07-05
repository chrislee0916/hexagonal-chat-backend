import { UserEntity } from '../../../../../iam/infrastructure/persistence/orm/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chatrooms')
export class ChatroomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'user1_id' })
  user1Id: number;

  @Column({ name: 'user2_id' })
  user2Id: number;

  @ManyToMany(() => ChatroomEntity)
  users: Pick<UserEntity, 'id' | 'name' | 'email' | 'image'>[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
