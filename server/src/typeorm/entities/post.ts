import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
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

export enum VoteStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  NONE = 'NONE',
}

registerEnumType(VoteStatus, {
  name: 'VoteStatus',
  description: 'voting options',
});

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

  @Field((_type) => Int)
  @Column({ type: 'int', default: 0 })
  points: number;

  @Field()
  @Column()
  creatorId!: string;

  @ManyToOne((_type) => User, (user) => user.posts)
  creator: User;

  @OneToMany((_type) => Updoot, (updoot) => updoot.post, { cascade: true })
  updoots!: Updoot[];

  @Field((_type) => VoteStatus, {
    defaultValue: VoteStatus.NONE,
  })
  voteStatus: VoteStatus;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
