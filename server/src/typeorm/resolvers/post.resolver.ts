import type { Context } from 'src/types';
import { User, Post, VoteStatus, Updoot } from '../entities';
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
import { In, QueryFailedError } from 'typeorm';
import { isAuth } from '../middleware/isAuth';
import { PostInput } from './types';

@Resolver((_of) => Post)
export class PostResolver {
  @Query((_returns) => [Post])
  async posts(
    @Arg('take', () => Int) take: number,
    @Arg('skip', () => Int) skip: number,
    @Ctx() { manager, req }: Context
  ): Promise<Post[]> {
    const { userId } = req.session;

    const realTake = Math.min(50, take);

    const posts = await manager
      .createQueryBuilder(Post, 'post')
      .leftJoinAndSelect('post.updoots', 'updoots')
      .orderBy('post.createdAt', 'DESC')
      .take(realTake)
      .skip(skip)
      .getMany();

    if (!userId) {
      return posts.map((post) => {
        post.voteStatus = VoteStatus.NONE;
        return post;
      });
    }

    const postIds = posts.map((post) => post.id);

    const updoots = await manager.find(Updoot, {
      where: { userId, postId: In(postIds) },
    });

    const updootMap: Record<string, Updoot> = {};
    updoots.forEach((updoot) => {
      updootMap[updoot.postId] = updoot;
    });

    return posts.map((post) => {
      const updoot = updootMap[post.id];
      if (updoot) {
        post.voteStatus =
          updoot.value === 1
            ? VoteStatus.UP
            : updoot.value === -1
            ? VoteStatus.DOWN
            : VoteStatus.NONE;
      } else {
        post.voteStatus = VoteStatus.NONE;
      }
      return post;
    });
  }

  @Query((_returns) => Post, { nullable: true })
  async post(
    @Arg('id') id: string,
    @Ctx() { req, manager }: Context
  ): Promise<Post | null> {
    const { userId } = req.session;
    const post = await manager.findOneBy(Post, { id });

    if (!post) throw new Error('Post not found!');

    if (!userId) {
      post.voteStatus = VoteStatus.NONE;
    }

    const updoot = await manager.findOneBy(Updoot, { userId, postId: post.id });

    if (updoot) {
      post.voteStatus =
        updoot.value === 1
          ? VoteStatus.UP
          : updoot.value === -1
          ? VoteStatus.DOWN
          : VoteStatus.NONE;
    } else {
      post.voteStatus = VoteStatus.NONE;
    }

    return post;
  }

  @Query((_returns) => Int)
  async postsCount(@Ctx() { manager }: Context) {
    return await manager.count(Post, {});
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
    post.voteStatus = VoteStatus.NONE;
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
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('id') id: string,
    @Arg('title') title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { manager, req }: Context
  ): Promise<Post | null> {
    const post = await manager
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and creatorId = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    return post.raw[0];
  }

  @Mutation((_returns) => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id') id: string,
    @Ctx() { manager, req }: Context
  ): Promise<Boolean | null> {
    const post = await manager
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where('id = :id and creatorId = :creatorId', {
        id,
        creatorId: req.session.userId,
      })
      .returning('*')
      .execute();

    if (!post.raw[0]) return false;

    return true;
  }

  @FieldResolver((_returns) => User)
  async postCreator(@Root() post: Post, @Ctx() { manager }: Context) {
    const creator = await manager.findOneBy(User, { id: post.creatorId });
    if (!creator) {
      throw new Error('There was no creator attached to this post');
    }
    return creator;
  }

  @FieldResolver((_returns) => String, { nullable: true })
  textSnippet(@Root() post: Post) {
    if (post.text) return post.text?.slice(0, 200);
    return null;
  }
}
