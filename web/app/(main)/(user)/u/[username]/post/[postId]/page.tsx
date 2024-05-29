import { Post } from './_components/post';

export default function PostPage({ params }: { params: { postId: string } }) {
  return <Post postId={params.postId} />;
}
