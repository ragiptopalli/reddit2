'use client';

import { formatDistanceToNow } from 'date-fns';

import { StarIcon, BadgeCheck } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { usePostsQuery } from '@/lib/graphql/generated/graphql';

export function FeedCard() {
  const { data } = usePostsQuery({
    variables: {
      skip: 0,
      take: 10,
    },
  });
  return (
    <section className='my-5 flex flex-col gap-5'>
      {data?.posts.length &&
        data.posts.map((post) => (
          <Card key={post.id} className='w-[740px]'>
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
                  <StarIcon className='mr-1 h-3 w-3' />
                  {post.points}k
                </div>
                <div>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </section>
  );
}
