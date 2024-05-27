'use client';

import {
  usePostsCountQuery,
  usePostsQuery,
} from '@/lib/graphql/generated/graphql';
import type { PostsQuery } from '@/lib/graphql/generated/graphql';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { toast } from 'sonner';
import { Skeleton } from '../../../components/ui/skeleton';
import { SinglePost } from './single-post';

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
        posts.map((post) => <SinglePost key={post.id} post={post} />)}
    </InfiniteScroll>
  );
}
