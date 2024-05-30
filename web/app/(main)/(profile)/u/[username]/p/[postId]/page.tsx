'use client';

import { SinglePost } from '@/app/(main)/_compontents/single-post';
import { usePostQuery } from '@/lib/graphql/generated/graphql';

export default function PostPage({ params }: { params: { postId: string } }) {
  const { data, loading, error } = usePostQuery({
    variables: {
      postId: params.postId,
    },
    skip: !params.postId,
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;
  if (!data?.post) return <h1>Post not found!</h1>;

  return <SinglePost post={data?.post} />;
}
