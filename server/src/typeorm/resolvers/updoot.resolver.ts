import { type Context } from 'src/types';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Post, Updoot } from '../entities';
import { UpdootInput } from './types/updoot.input';

@Resolver()
export class UpdootResolver {
  @Mutation((_returns) => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('input') input: UpdootInput,
    @Ctx() { req, manager }: Context
  ): Promise<Boolean> {
    const { userId } = req.session;
    const { value, postId } = input;

    if (![1, -1].includes(value)) {
      throw new Error('Invalid vote value');
    }

    const updoot = await manager.findOneBy(Updoot, { postId, userId });

    if (updoot && updoot.value !== value) {
      await manager.transaction(async (tem) => {
        const post = await tem.findOneBy(Post, { id: postId });
        if (!post) throw new Error('Post not found!');

        updoot.value = value;

        await tem.save(updoot);

        post.points = post.points + 2 * value;

        await tem.save(post);
      });
    } else {
      manager.transaction(async (tem) => {
        const post = await tem.findOneBy(Post, { id: postId });
        if (!post) throw new Error('Post not found!');

        const newUpdoot = tem.create(Updoot, {
          userId,
          postId,
          value,
        });

        await tem.save(newUpdoot);

        post.points = post.points + value;

        await tem.save(post);
      });
    }

    return true;
  }
}
