import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @Index('email_idx', { unique: true })
  email: string;

  @Column()
  password: string;
}
