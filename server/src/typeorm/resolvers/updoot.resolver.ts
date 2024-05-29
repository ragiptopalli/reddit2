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

    const valueMap = {
      [VoteStatus.UP]: 1,
      [VoteStatus.DOWN]: -1,
      [VoteStatus.NONE]: 0,
    };

    const newValue = valueMap[status];

    return manager.transaction(async (tm) => {
      const post = await tm.findOneBy(Post, { id: postId });
      if (!post) throw new Error('Post not found!');

      const updoot = await tm.findOneBy(Updoot, { postId, userId });

      if (updoot) {
        if (updoot.value === valueMap[status]) {
          await tm.update(Updoot, { postId, userId }, { value: 0 });
          post.voteStatus = VoteStatus.NONE;
        } else {
          await tm.update(Updoot, { postId, userId }, { value: newValue });
          post.voteStatus = status;
        }
      } else {
        await tm.insert(Updoot, { postId, userId, value: newValue });
        post.voteStatus = status;
      }

      const newPoints = await tm
        .createQueryBuilder(Updoot, 'updoot')
        .where('updoot.postId = :postId', { postId })
        .select('SUM(updoot.value)', 'sum')
        .getRawOne();

      console.log(newPoints, 'NEW POINTSS');

      post.points = newPoints ? parseInt(newPoints.sum) : 0;
      await tm.save(post);
      return true;
    });
  }
}
