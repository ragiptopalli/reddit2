'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCustomTimeFormat } from '@/lib/getCustomTimeFormat';
import {
  useVoteMutation,
  type PostsQuery,
  VoteStatus,
  PostSnippetFragment,
} from '@/lib/graphql/generated/graphql';
import { gql } from '@apollo/client';
import { BadgeCheck, ChevronDown, ChevronUp, Dot, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    <section className='w-full'>
      <Card>
        <CardHeader>
          <div className='space-x-2 flex items-center'>
            <Link href={`/u/${post.postCreator.username}`}>
              <div className='flex items-center '>
                <span>{post.postCreator.username}</span>
                <BadgeCheck className='ml-1.5 h-5 w-5 fill-primary text-background' />
              </div>
            </Link>
            <Dot className='h-3 w-3 fill-primary' />
            <Link href={`/u/${post.postCreator.username}`}>
              <div className='hover:underline'>
                {getCustomTimeFormat(new Date(post.createdAt))}
              </div>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.textSnippet}</CardDescription>
        </CardContent>
        <CardFooter>
          <div className='flex space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center'>
              <Button
                onClick={() => {
                  handleVote(VoteStatus.Up);
                }}
                variant={
                  post.voteStatus === VoteStatus.Up ? 'default' : 'outline'
                }
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
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export { SinglePost };
