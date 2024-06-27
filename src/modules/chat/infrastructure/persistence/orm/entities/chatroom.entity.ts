import { UserEntity } from 'src/modules/iam/infrastructure/persistence/orm/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chatrooms')
export class ChatroomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  users: Pick<UserEntity, 'id' | 'name' | 'email' | 'image'>[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}
