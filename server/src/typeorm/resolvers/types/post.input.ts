import { Post } from '../../entities';
import { Field, InputType } from 'type-graphql';

@InputType()
export class PostInput implements Partial<Post> {
  @Field()
  title: string;
  @Field({ nullable: true })
  text: string;
}
