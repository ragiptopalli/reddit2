'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

import Link from 'next/link';
import { HamburgerMenuIcon, RocketIcon } from '@radix-ui/react-icons';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '@/lib/graphql/generated/graphql';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CircleUser, Loader2 } from 'lucide-react';
import { CreatePostModal } from './create-post-modal';

export const Header = () => {
  const pathname = usePathname();

  const [logout] = useLogoutMutation();
  const { data, loading } = useMeQuery();

  if (loading) return <Loader2 className='mt-2 h-4 w-4 animate-spin' />;

  const handleLogout = () => {
    logout({
      update(cache, { data }) {
        const existing = cache.readQuery<MeQuery>({
          query: MeDocument,
        });

        if (!existing || !data?.logout) return;

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: null,
          },
        });
      },
    });
  };

  return (
    <header className='h-16 gap-4 flex w-full sticky top-0 bg-background items-center justify-between border-b border-border/40 px-4 md:px-6'>
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
            {!data?.me && (
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
            )}
          </nav>
        </SheetContent>
      </Sheet>
      {!data?.me ? (
        <div className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
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
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <CreatePostModal />
          <UserMenu username={data.me.username} onHandleLogout={handleLogout} />
        </div>
      )}
    </header>
  );
};

const UserMenu = ({
  onHandleLogout,
  username,
}: {
  onHandleLogout: () => void;
  username: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <CircleUser className='h-5 w-5' />
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className='gap-2 h-10'>
          <span className='hidden md:block'>Toggle Theme</span> <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onHandleLogout} className='cursor-pointer'>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
