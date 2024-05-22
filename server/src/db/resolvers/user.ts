import { isQueryFailedError } from '../../../utils/pgQueryError';
import { MyContext } from 'src/types';
import { User } from '../entities/User';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import { COOKIE_NAME } from '../../constants';

const SALT_ROUNDS = 12;

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;
  @Field()
  password!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field?: string;

  @Field()
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { manager, req }: MyContext) {
    const { userId } = req.session;

    if (!userId) {
      return null;
    }

    const user = await manager.findOne(User, {
      where: { id: userId },
    });

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    if (username.length < 2) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username should be at least 2 characters long!',
          },
        ],
      };
    }

    if (password.length < 3) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Password should be at least 3 characters long!',
          },
        ],
      };
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = manager.create(User, {
      username,
      password: hashedPassword,
    });

    try {
      await manager.save(user);
    } catch (err) {
      if (isQueryFailedError(err)) {
        if (err.code === '23505') {
          return {
            errors: [
              {
                field: 'username',
                message: 'Username already taken!',
              },
            ],
          };
        }
      }
      throw new Error("There's an error with the signup");
    }

    // set the cookie and auto login the user
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password } = options;

    const user = await manager.findOneBy(User, { username });

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'The username does not exist',
          },
        ],
      };
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return {
        errors: [
          {
            field: 'password',
            message: 'The password is incorrect',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
