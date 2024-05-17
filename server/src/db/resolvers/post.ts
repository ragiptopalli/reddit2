import { MyContext } from 'src/types';
import { Post } from '../entities/Post';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { manager }: MyContext): Promise<Post[]> {
    return manager.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post | null> {
    return manager.findOneBy(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { manager }: MyContext
  ): Promise<Post> {
    const post = manager.create(Post, { title, text });
    await manager.save(post);
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

    await manager.save(post);
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
      return false;
    }
  }
}
