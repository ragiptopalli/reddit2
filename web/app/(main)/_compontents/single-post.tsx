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
  MessageCircleIcon,
  ShareIcon,
} from 'lucide-react';
import Link from 'next/link';

import { DropdownActions } from './post-dropdown-actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

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
    <section className='col-span-4 md:col-span-2 '>
      <Card>
        <CardContent className='p-4'>
          <CardHeader className='p-0 mb-4'>
            <CardHeaderContent post={post} />
          </CardHeader>
          <Image
            src='/placeholder.svg'
            alt='Tweet image'
            width='1920'
            height='1080'
            className='rounded-md w-full'
          />
          <Separator className='my-2' />
          <CardFooter className='p-0 gap-2'>
            <VoteButtons
              points={post.points}
              voteStatus={post.voteStatus}
              onHandleVote={handleVote}
              loading={loading}
            />
            <Button variant='outline' size='icon'>
              <MessageCircleIcon className='h-5 w-5' />
              <span className='sr-only'>Comment</span>
            </Button>
            <Button variant='outline' size='icon'>
              <ShareIcon className='h-5 w-5' />
              <span className='sr-only'>Share</span>
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
};

const CardHeaderContent = ({ post }: { post: PostsQuery['posts'][0] }) => {
  return (
    <>
      <div className='flex justify-between pb-4'>
        <div className='flex gap-2'>
          <Avatar>
            <Image
              width='84'
              height='84'
              src='/placeholder.svg'
              alt={`${post.postCreator.username}'s avatar`}
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className='flex'>
            <Link href={`/u/${post.postCreator.username}`}>
              <div className='flex items-center '>
                <span>{post.postCreator.username}</span>
                <BadgeCheckIcon className='ml-1.5 h-5 w-5 fill-primary text-background' />
                <DotIcon className='h-3 w-3 fill-primary' />
              </div>
            </Link>
            <Link href={`/u/${post.postCreator.username}/p/${post.id}`}>
              <div className='hover:underline'>
                {getCustomTimeFormat(new Date(post.createdAt))}
              </div>
            </Link>
          </div>
        </div>
        <DropdownActions
          postId={post.id}
          postTitle={post.title}
          postText={post.text}
        />
      </div>
      <CardTitle>{post.title}</CardTitle>
      <CardDescription>{post.textSnippet}</CardDescription>
    </>
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
