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
    fetchPolicy: 'cache-and-network',
  });

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
    <>
      {!loading && posts.length > 0 ? (
        <InfiniteScroll
          className='flex flex-col space-y-4 w-full max-w-screen-xl justify-between'
          initialLoad={false}
          threshold={5}
          hasMore={posts.length < postsCount}
          loadMore={loadMorePosts}
        >
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <SinglePost key={post.id} post={post} />)}
        </InfiniteScroll>
      ) : (
        <>
          <div className='flex flex-col space-y-4 w-full max-w-screen-xl justify-between'>
            <Skeleton className='h-[195px] w-[740px] rounded-xl' />
          </div>
        </>
      )}
    </>
  );
}
