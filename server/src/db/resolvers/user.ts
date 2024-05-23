import { isQueryFailedError } from '../../../utils/pgQueryError';
import { MyContext, UsernamePasswordInput } from '../../types';
import { User } from '../entities/User';

import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

import bcrypt from 'bcrypt';
import { COOKIE_NAME } from '../../constants';
import { validateRegister } from '../../../utils/validateRegister';

const SALT_ROUNDS = 12;

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

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('email') email: string,
    @Ctx() { manager }: MyContext
  ) {
    console.log(email);
    const user = await manager.findOne(User, {
      where: { email },
    });

    if (!user) {
      throw new Error('User with that email does not exist');
    }

    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<UserResponse> {
    const { username, password, email } = options;

    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = manager.create(User, {
      username,
      password: hashedPassword,
      email,
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

  @Mutation(() => User)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { manager, req }: MyContext
  ): Promise<User> {
    const user = await manager.findOne(User, {
      where: !usernameOrEmail.includes('@')
        ? { username: usernameOrEmail }
        : { email: usernameOrEmail },
    });

    if (!user) {
      throw new Error('The username does not exist');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new Error('The password is incorrect');
    }

    req.session.userId = user.id;

    return user;
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
