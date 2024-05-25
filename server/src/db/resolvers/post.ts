import { MyContext } from 'src/types';
import { Post } from '../entities/Post';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { QueryFailedError } from 'typeorm';
import { isAuth } from '../middleware/isAuth';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  text: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { manager }: MyContext): Promise<Post[]> {
    return await manager
      .createQueryBuilder(Post, 'post')
      .orderBy('post.createdAt', 'DESC')
      .getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('id') id: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | null> {
    return await manager.findOneBy(Post, { id });
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { manager, req }: MyContext
  ): Promise<Post> {
    const post = manager.create(Post, {
      ...input,
      creatorId: req.session.userId,
    });
    try {
      await manager.save(post);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occured!');
      }
    }
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('title') title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | null> {
    const post = await manager.findOneBy(Post, { id });

    if (!post) {
      throw new Error('Could not find the post!');
    }

    post.title = title;
    post.text = text;

    try {
      await manager.save(post);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occured!');
      }
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() { manager }: MyContext
  ): Promise<boolean> {
    try {
      await manager.delete(Post, { id });
      return true;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occured!');
      }
    }
  }
}
