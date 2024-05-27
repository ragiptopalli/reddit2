import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { User } from './user';
import { Post } from './post';

@ObjectType()
@Entity()
export class Updoot {
  @Field((_type) => Int)
  @Column({ type: 'int' })
  value: number;

  @Field()
  @PrimaryColumn()
  userId!: string;

  @ManyToOne((_type) => User, (user) => user.updoots)
  user: User;

  @Field()
  @PrimaryColumn()
  postId!: string;

  @ManyToOne((_type) => Post, (post) => post.updoots)
  post: Post;
}
