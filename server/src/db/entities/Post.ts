import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @CreateDateColumn({ default: new Date() })
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  text!: string;
}
