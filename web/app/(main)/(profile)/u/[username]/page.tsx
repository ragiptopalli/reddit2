export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  return <h1>{params.username}</h1>;
}
