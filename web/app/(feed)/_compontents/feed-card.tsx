'use client';

import { formatDistanceToNow } from 'date-fns';

import {
  type PostsQuery,
  usePostsCountQuery,
  usePostsQuery,
} from '@/lib/graphql/generated/graphql';
import { BadgeCheck, StarIcon } from 'lucide-react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';

const RESULTS_PER_PAGE = 10;

export function FeedCard() {
  const [offset, setOffset] = useState<number>(0);
  const { data: { postsCount = 0 } = {} } = usePostsCountQuery();

  const {
    data: { posts = [] } = {},
    loading,
    fetchMore,
  } = usePostsQuery({
    variables: {
      take: RESULTS_PER_PAGE,
      skip: 0,
    },
    onCompleted() {
      if (offset >= postsCount) return;
      setOffset((prev) => prev + 10);
    },
  });

  if (loading) {
    return (
      <>
        {Array.from({ length: 10 }).map((_, idx) => (
          <div className='flex flex-col space-y-3' key={`${idx}-loadingFeed`}>
            <Skeleton className='h-[125px] w-[250px] rounded-xl' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[250px]' />
              <Skeleton className='h-4 w-[200px]' />
            </div>
          </div>
        ))}
      </>
    );
  }

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: offset,
      },
      updateQuery: (
        previousResult: PostsQuery,
        options: { fetchMoreResult: PostsQuery }
      ) => {
        return {
          posts: [...previousResult?.posts, ...options.fetchMoreResult.posts],
        };
      },
    }).catch(() => toast.error('Something went wrong'));
  };

  return (
    <InfiniteScroll
      initialLoad={false}
      threshold={20}
      hasMore={posts.length < postsCount}
      loadMore={loadMorePosts}
    >
      {posts.length &&
        posts.map((post) => (
          <section key={post.id} className='my-5 flex flex-col gap-5'>
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
          </section>
        ))}
    </InfiniteScroll>
  );
}
