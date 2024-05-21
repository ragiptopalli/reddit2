'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

import Link from 'next/link';
import { FrameIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className='h-16 gap-4 flex w-full items-center justify-between border-b border-border/40 px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <FrameIcon className='h-6 w-6' />
          <span className='sr-only'>Reddit</span>
        </Link>
        <Link
          href='/about'
          className={`${
            pathname === '/about' ? 'text-foreground' : 'text-muted-foreground'
          } transition-colors hover:text-foreground`}
        >
          About
        </Link>
        <Link
          href='/register'
          className={`${
            pathname === '/register'
              ? 'text-foreground'
              : 'text-muted-foreground'
          } transition-colors hover:text-foreground`}
        >
          Register
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <HamburgerMenuIcon className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='/'
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <FrameIcon className='h-6 w-6' />
              <span className='sr-only'>Reddit</span>
            </Link>
            <Link
              href='/about'
              className={`${
                pathname === '/about'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }  hover:text-foreground`}
            >
              About
            </Link>
            <Link
              href='/register'
              className={`${
                pathname === '/register'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }  hover:text-foreground`}
            >
              Register
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <ThemeToggle />
    </header>
  );
};
