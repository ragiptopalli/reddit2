import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdootInput {
  @Field()
  postId: string;

  @Field((_of) => Int)
  value: number;
}
