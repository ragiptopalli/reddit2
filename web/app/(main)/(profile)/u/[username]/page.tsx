import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { CalendarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  return (
    <section className='col-span-4 md:col-span-2'>
      <Card className='rounded-2xl overflow-hidden'>
        <div className='relative h-32 sm:h-40 md:h-48'>
          <Image
            src='/placeholder.svg'
            alt='Banner'
            width='1920'
            height='1080'
            className='w-full h-full object-cover'
          />
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 to-transparent h-1/2' />
        </div>
        <div className='px-6 py-6 sm:px-8 sm:py-8'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-16 h-16 sm:w-20 sm:h-20 border-4 border-white dark:border-gray-950'>
              <Image
                src='/placeholder.svg'
                alt='@username'
                width='84'
                height='84'
                className='aspect-square w-full object-cover'
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex-1 grid gap-1'>
              <div className='text-lg font-semibold'>{params.username}</div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                @johndoe
              </div>
            </div>
          </div>
          <div className='mt-4 sm:mt-6 text-sm text-gray-500 dark:text-gray-400'>
            I am a software engineer and I love to code! Passionate about
            building innovative products.
          </div>
          <div className='mt-4 sm:mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400'>
            <CalendarIcon className='mr-2 h-4 w-4' />
            Joined June 2021
          </div>
        </div>
      </Card>
    </section>
  );
}
