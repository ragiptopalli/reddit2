'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useVoteMutation,
  type PostsQuery,
  VoteStatus,
  PostSnippetFragment,
} from '@/lib/graphql/generated/graphql';
import { gql } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

type PartialPostFragment = Partial<Pick<PostSnippetFragment, 'id'>> &
  Pick<PostSnippetFragment, 'voteStatus' | 'points'>;

const SinglePost = ({ post }: { post: PostsQuery['posts'][0] }) => {
  const [vote, { loading }] = useVoteMutation();

  const handleVote = async (status: VoteStatus) => {
    await vote({
      variables: {
        input: {
          postId: post.id,
          status,
        },
      },
      update: (cache, { data }) => {
        const existing = cache.readFragment<PartialPostFragment>({
          id: `Post:${post.id}`,
          fragment: gql`
            fragment _ on Post {
              id
              voteStatus
              points
            }
          `,
        });

        if (!existing || !data) return;

        let newPoints = post.points;
        let newStatus = post.voteStatus;
        if (data?.vote) {
          if (post.voteStatus === VoteStatus.Up && status === VoteStatus.Up) {
            newPoints -= 1;
            newStatus = VoteStatus.None;
          } else if (
            post.voteStatus === VoteStatus.Down &&
            status === VoteStatus.Down
          ) {
            newPoints += 1;
            newStatus = VoteStatus.None;
          } else if (
            post.voteStatus === VoteStatus.None &&
            status === VoteStatus.Up
          ) {
            newPoints += 1;
            newStatus = VoteStatus.Up;
          } else if (
            post.voteStatus === VoteStatus.None &&
            status === VoteStatus.Down
          ) {
            newPoints -= 1;
            newStatus = VoteStatus.Down;
          } else if (
            post.voteStatus === VoteStatus.Up &&
            status === VoteStatus.Down
          ) {
            newPoints -= 2;
            newStatus = VoteStatus.Down;
          } else if (
            post.voteStatus === VoteStatus.Down &&
            status === VoteStatus.Up
          ) {
            newPoints += 2;
            newStatus = VoteStatus.Up;
          }
        }

        cache.writeFragment<PartialPostFragment>({
          id: `Post:${post.id}`,
          fragment: gql`
            fragment __ on Post {
              voteStatus
              points
            }
          `,
          data: {
            points: data.vote ? newPoints : existing.points,
            voteStatus: data.vote ? newStatus : existing.voteStatus,
          },
        });
      },
    });
  };

  return (
    <section className='my-5 flex flex-col gap-5'>
      <Card className='w-[740px]'>
        <CardHeader className='grid grid-cols-[1fr_110px] items-start gap-4 space-y-0'>
          <div className='space-y-1'>
            <div className='flex items-center mb-4'>
              {post.postCreator.username}
              <BadgeCheck className='ml-1.5 h-5 w-5 fill-primary text-background' />
            </div>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{post.textSnippet}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center'>
              <Button
                onClick={() => {
                  handleVote(VoteStatus.Up);
                }}
                variant={
                  post.voteStatus === VoteStatus.Up ? 'default' : 'outline'
                }
                size='sm'
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ChevronUp className='h-4 w-4' />
                )}
              </Button>
              <span className='mx-2'>{post.points}</span>
              <Button
                onClick={() => {
                  handleVote(VoteStatus.Down);
                }}
                variant={
                  post.voteStatus === VoteStatus.Down
                    ? 'destructive'
                    : 'outline'
                }
                size='sm'
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
            <div>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export { SinglePost };
