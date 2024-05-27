import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from './post';
import { Updoot } from './updoot';
@ObjectType()
@Entity('users') // because 'user' is a reserved word in postgresql
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany((_type) => Post, (post) => post.creator)
  posts!: Post[];

  @OneToMany((_type) => Updoot, (updoot) => updoot.user)
  updoots!: Updoot[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
