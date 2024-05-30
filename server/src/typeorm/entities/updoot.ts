import { Entity, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { User } from './user';
import { Post } from './post';

@Entity()
export class Updoot {
  @Column({ type: 'int' })
  value: number;

  @PrimaryColumn()
  userId!: string;

  @ManyToOne((_type) => User, (user) => user.updoots)
  user: User;

  @PrimaryColumn()
  postId!: string;

  @ManyToOne((_type) => Post, (post) => post.updoots, { onDelete: 'CASCADE' })
  post: Post;
}
