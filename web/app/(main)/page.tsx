import { FeedCard } from './_compontents/feed-card';

export default function Dashboard() {
  return (
    <div className='container flex gap-4 justify-between mt-4 max-w-screen-xl'>
      <div className='w-[380px] h-[380px] bg-background rounded-xl border'>
        Something cool is coming...
      </div>
      <FeedCard />
      <div className='w-[380px] h-[380px] bg-background rounded-xl border'>
        something cool is coming...
      </div>
    </div>
  );
}
