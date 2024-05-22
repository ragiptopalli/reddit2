'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

import Link from 'next/link';
import { HamburgerMenuIcon, RocketIcon } from '@radix-ui/react-icons';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { useMeQuery } from '@/lib/graphql/generated/graphql';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CircleUser } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();

  const { data, loading, error } = useMeQuery();

  if (loading) {
    return 'Loading..';
  }

  if (error) {
    return 'theres an error!';
  }

  return (
    <header className='h-16 gap-4 flex w-full items-center justify-between border-b border-border/40 px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          href='/'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <RocketIcon className='h-6 w-6' />
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
              <RocketIcon className='h-6 w-6' />
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
            {!data?.me ? (
              <>
                <Link
                  href='/login'
                  className={`${
                    pathname === '/login'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }  hover:text-foreground`}
                >
                  Login
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
              </>
            ) : (
              <h3>{data.me.username}</h3>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      <div className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        {!data?.me ? (
          <>
            <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
              <Link
                href='/login'
                className={`${
                  pathname === '/login'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                } transition-colors hover:text-foreground`}
              >
                Login
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
            </div>
            <ThemeToggle />
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>{data.me.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='cursor-pointer'>
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='gap-2 h-10'>
                Toggle Theme <ThemeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
