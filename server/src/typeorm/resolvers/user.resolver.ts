import { isQueryFailedError } from '../../../utils/pgQueryError';
import { Context, UsernamePasswordInput } from '../../types';
import { User } from '../entities';

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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../../constants';
import { validateRegister } from '../../../utils/validateRegister';
import { sendEmail } from '../../../utils/sendEmail';

const SALT_ROUNDS = 12;
const EXPIRY_IN_SECONDS = 3600; // 1 hour

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
  async me(@Ctx() { manager, req }: Context) {
    const { userId } = req.session;

    if (!userId) {
      return null;
    }

    const user = await manager.findOne(User, {
      where: { id: userId },
    });

    return user;
  }

  @Mutation(() => User)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { manager, redis, req }: Context
  ): Promise<User> {
    if (newPassword.length < 3) {
      throw new Error('Password should be at least 3 characters long!');
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      throw new Error('The token is invalid!');
    }

    const user = await manager.findOneBy(User, { id: userId });

    if (!user) {
      throw new Error('User no longer exists!');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    try {
      await manager.save(user);
      await redis.del(key);
    } catch (err) {
      throw new Error('Could not reset the password!');
    }

    // log in user after changing the password
    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async forgetPassowrdLink(
    @Arg('email') email: string,
    @Ctx() { manager, redis }: Context
  ) {
    console.log(email);
    const user = await manager.findOne(User, {
      where: { email },
    });

    if (!user) {
      return false;
    }

    const token = crypto.randomUUID();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'EX',
      EXPIRY_IN_SECONDS
    );

    sendEmail(
      email,
      `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { manager, req }: Context
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
    @Ctx() { manager, req }: Context
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
  logout(@Ctx() { req, res }: Context): Promise<Boolean> {
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
