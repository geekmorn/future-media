import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TagEntity } from './tag.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 240 })
  content!: string;

  @Column({ type: 'uuid' })
  authorId!: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author!: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.posts, { cascade: true })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags!: TagEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}
