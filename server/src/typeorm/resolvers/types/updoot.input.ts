import { VoteStatus } from '../../entities';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdootInput {
  @Field()
  postId: string;

  @Field((_type) => VoteStatus)
  status: VoteStatus;
}
