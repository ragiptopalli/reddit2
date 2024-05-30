import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  return (
    <section className='w-full'>
      <Card>
        <CardHeader className='p-2'>
          <h1>{params.username}</h1>
        </CardHeader>
        <CardContent className='py-4 px-2'>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardContent>
        <CardFooter className='p-2'>
          <div>Footeri</div>
        </CardFooter>
      </Card>
    </section>
  );
}
