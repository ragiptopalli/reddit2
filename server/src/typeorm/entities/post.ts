import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user';
import { Updoot } from './updoot';

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  text?: string;

  @Field((_type) => Int, { nullable: true })
  @Column({ type: 'int', default: 0 })
  points: number;

  @Field()
  @Column()
  creatorId!: string;

  @ManyToOne((_type) => User, (user) => user.posts)
  creator: User;

  @OneToMany((_type) => Updoot, (updoot) => updoot.post)
  updoots!: Updoot[];

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
