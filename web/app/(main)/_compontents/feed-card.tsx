'use client';

import { usePostsQuery } from '@/lib/graphql/generated/graphql';
import type { PostsQuery } from '@/lib/graphql/generated/graphql';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { toast } from 'sonner';
import { Skeleton } from '../../../components/ui/skeleton';
import { SinglePost } from './single-post';

const RESULTS_PER_PAGE = 10;

export function FeedCard() {
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const {
    data: { posts = [] } = {},
    loading,
    fetchMore,
  } = usePostsQuery({
    variables: {
      take: RESULTS_PER_PAGE,
      skip: 0,
    },
    onCompleted(data) {
      if (data.posts.length < RESULTS_PER_PAGE) {
        setHasMore(false);
      }
      setOffset(RESULTS_PER_PAGE);
    },
  });

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: offset,
        take: RESULTS_PER_PAGE,
      },
      updateQuery: (
        previousResult: PostsQuery,
        { fetchMoreResult }: { fetchMoreResult: PostsQuery }
      ) => {
        if (!fetchMoreResult || fetchMoreResult.posts.length === 0) {
          setHasMore(false);
          return previousResult;
        }
        setOffset(offset + RESULTS_PER_PAGE);
        return {
          ...previousResult,
          posts: [...previousResult.posts, ...fetchMoreResult.posts],
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
          hasMore={hasMore}
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
