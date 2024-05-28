import type { Context } from 'src/types';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Post, Updoot, VoteStatus } from '../entities';
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
    const { status, postId } = input;

    const post = await manager.findOneBy(Post, { id: postId });
    if (!post) throw new Error('Post not found!');

    const updoot = await manager.findOneBy(Updoot, { postId, userId });

    const valueMap = {
      [VoteStatus.UP]: 1,
      [VoteStatus.DOWN]: -1,
      [VoteStatus.NONE]: 0,
    };

    const newValue = valueMap[status];

    if (updoot) {
      if (updoot.value === newValue) {
        await manager.update(Updoot, { postId, userId }, { value: 0 });
        post.voteStatus = VoteStatus.NONE;
      } else {
        await manager.update(Updoot, { postId, userId }, { value: newValue });
        post.voteStatus = status;
      }
    } else {
      await manager.insert(Updoot, { postId, userId, value: newValue });
      post.voteStatus = status;
    }

    post.points = (await manager.sum(Updoot, 'value', { postId })) ?? 0;
    await manager.save(post);

    return true;
  }
}
