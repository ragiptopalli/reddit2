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
import { Separator } from '@/components/ui/separator';
import { getCustomTimeFormat } from '@/lib/getCustomTimeFormat';
import {
  PostSnippetFragment,
  VoteStatus,
  useVoteMutation,
} from '@/lib/graphql/generated/graphql';
import type { PostsQuery } from '@/lib/graphql/generated/graphql';
import { gql } from '@apollo/client';
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DotIcon,
} from 'lucide-react';
import Link from 'next/link';

import { DropdownActions } from './post-dropdown-actions';

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

        const voteValueMap = {
          [VoteStatus.Up]: 1,
          [VoteStatus.Down]: -1,
          [VoteStatus.None]: 0,
        };

        const existingVoteValue = voteValueMap[post.voteStatus];
        const newVoteValue = voteValueMap[status];

        if (existingVoteValue === newVoteValue) {
          newPoints -= existingVoteValue;
          newStatus = VoteStatus.None;
        } else {
          newPoints = newPoints - existingVoteValue + newVoteValue;
          newStatus = status;
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
        <CardHeader className='p-2'>
          <CardHeaderContent post={post} />
        </CardHeader>
        <Separator className='w-[95%] mx-auto' />
        <CardContent className='py-4 px-2'>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.text}</CardDescription>
        </CardContent>
        <Separator className='w-[95%] mx-auto' />
        <CardFooter className='p-2'>
          <VoteButtons
            points={post.points}
            voteStatus={post.voteStatus}
            onHandleVote={handleVote}
            loading={loading}
          />
        </CardFooter>
      </Card>
    </section>
  );
};

const CardHeaderContent = ({ post }: { post: PostsQuery['posts'][0] }) => {
  return (
    <div className='space-x-2 flex items-center justify-between'>
      <div className='flex items-center'>
        <Link href={`/u/${post.postCreator.username}`}>
          <div className='flex items-center '>
            <span>{post.postCreator.username}</span>
            <BadgeCheckIcon className='ml-1.5 h-5 w-5 fill-primary text-background' />
          </div>
        </Link>
        <DotIcon className='h-3 w-3 fill-primary' />
        <Link href={`/u/${post.postCreator.username}/p/${post.id}`}>
          <div className='hover:underline'>
            {getCustomTimeFormat(new Date(post.createdAt))}
          </div>
        </Link>
      </div>
      <DropdownActions
        postId={post.id}
        postTitle={post.title}
        postText={post.text}
      />
    </div>
  );
};

const VoteButtons = ({
  points,
  voteStatus,
  onHandleVote,
  loading,
}: {
  points: number;
  voteStatus: VoteStatus;
  onHandleVote: (status: VoteStatus) => void;
  loading: boolean;
}) => {
  return (
    <div className='flex items-center border rounded-md bg-background p-1'>
      <Button
        onClick={() => {
          onHandleVote(VoteStatus.Up);
        }}
        variant={voteStatus === VoteStatus.Up ? 'default' : 'ghost'}
        disabled={loading}
        className='h-7 w-7 p-0'
      >
        <ChevronUpIcon />
      </Button>
      <span className='mx-2'>{points}</span>
      <Button
        onClick={() => {
          onHandleVote(VoteStatus.Down);
        }}
        variant={voteStatus === VoteStatus.Down ? 'secondary' : 'ghost'}
        disabled={loading}
        className='h-7 w-7 p-0'
      >
        <ChevronDownIcon />
      </Button>
    </div>
  );
};

export { SinglePost };
