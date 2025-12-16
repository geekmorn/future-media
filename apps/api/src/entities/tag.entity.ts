import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => PostEntity, (post) => post.tags)
  posts!: PostEntity[];
}
