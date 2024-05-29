'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

import Link from 'next/link';
import { HamburgerMenuIcon, RocketIcon } from '@radix-ui/react-icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLogoutMutation, useMeQuery } from '@/lib/graphql/generated/graphql';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CircleUser, Loader2 } from 'lucide-react';
import { CreatePostModal } from './create-post-modal';
import { toast } from 'sonner';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [logout, { client }] = useLogoutMutation({
    onCompleted() {
      toast.success('Logged out successfully, redirecting...', {
        duration: 1500,
        position: 'top-center',
      });
      router.push('/');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { data, loading } = useMeQuery();

  if (loading) return <Loader2 className='mt-2 h-4 w-4 animate-spin' />;

  const handleLogout = async () => {
    await logout();
    await client.resetStore();
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 max-w-screen-xl items-center'>
        <nav className='hidden md:flex space-x-2'>
          <Link href='/' className='text-xl font-semibold md:text-base'>
            <RocketIcon className='h-6 w-6' />
            <span className='sr-only'>Reddit</span>
          </Link>
          <Link
            href='/about'
            className={`${
              pathname === '/about'
                ? 'text-foreground'
                : 'text-muted-foreground'
            } transition-colors hover:text-foreground`}
          >
            About
          </Link>
        </nav>
        <MobileNav pathname={pathname} />
        {!data?.me ? (
          <div className='flex flex-1 items-center space-x-4 justify-end'>
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
            <ThemeToggle />
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
            <CreatePostModal />
            <UserMenu
              username={data.me.username}
              onHandleLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </header>
  );
};

const UserMenu = ({
  onHandleLogout,
  username,
}: {
  onHandleLogout: () => Promise<void>;
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

const MobileNav = ({ pathname }: { pathname: string }) => {
  return (
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
        </nav>
      </SheetContent>
    </Sheet>
  );
};
