import GoBackButton from '@/components/go-back-button';
export default async function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-2'>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <GoBackButton />
    </div>
  );
}
