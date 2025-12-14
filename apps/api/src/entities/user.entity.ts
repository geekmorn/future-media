import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  googleId!: string | null;

  @Column({ type: 'varchar', length: 7, default: '#6366f1' })
  color!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts!: PostEntity[];
}
