import { Context } from 'src/types';
import { User, Post } from '../entities';
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { QueryFailedError } from 'typeorm';
import { isAuth } from '../middleware/isAuth';
import { PostInput } from './types';

@Resolver((_of) => Post)
export class PostResolver {
  @Query((_return) => [Post])
  async posts(
    @Arg('take', () => Int) take: number,
    @Arg('skip', () => Int) skip: number,
    @Ctx() { manager }: Context
  ): Promise<Post[]> {
    const realTake = Math.min(50, take);
    return await manager
      .createQueryBuilder(Post, 'post')
      .orderBy('post.createdAt', 'DESC')
      .take(realTake)
      .skip(skip)
      .getMany();
  }

  @Query((_returns) => Int)
  async postsCount(@Ctx() { manager }: Context) {
    return await manager.count(Post, {});
  }

  @Query((_returns) => Post, { nullable: true })
  async post(
    @Arg('id') id: string,
    @Ctx() { manager }: Context
  ): Promise<Post | null> {
    return await manager.findOneBy(Post, { id });
  }

  @Mutation((_returns) => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { manager, req }: Context
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
        throw new Error('An unexpected error occurred!');
      }
    }
    return post;
  }

  @Mutation((_returns) => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: string,
    @Arg('title') title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { manager }: Context
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
        throw new Error('An unexpected error occurred!');
      }
    }

    return post;
  }

  @Mutation((_returns) => Boolean)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() { manager }: Context
  ): Promise<boolean> {
    try {
      await manager.delete(Post, { id });
      return true;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occurred!');
      }
    }
  }

  @FieldResolver((_returns) => User)
  async postCreator(@Root() post: Post, @Ctx() { manager }: Context) {
    const creator = await manager.findOneBy(User, { id: post.creatorId });
    if (!creator) {
      throw new Error('There was no creator attached to this post');
    }
    return creator;
  }

  @FieldResolver((_returns) => String)
  textSnippet(@Root() post: Post) {
    if (post.text) return post.text?.slice(0, 200);
    return null;
  }
}
