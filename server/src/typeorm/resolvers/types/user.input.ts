import { User } from '../../entities';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UsernamePasswordInput implements Partial<User> {
  @Field()
  username!: string;
  @Field()
  password!: string;
  @Field()
  email!: string;
}
