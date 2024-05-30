'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLogoutMutation, useMeQuery } from '@/lib/graphql/generated/graphql';
import { HamburgerMenuIcon, RocketIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { CircleUser, CogIcon, Loader2, LogOutIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CreatePostModal } from './create-post-modal';
import { UserSettings } from './user-settings';

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
          <div className='flex flex-1 items-center space-x-2 justify-end'>
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
  const [settingsModal, setSettingsModal] = useState(false);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <CircleUser className='h-5 w-5' />
          <span className='sr-only'>Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[140px]'>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='h-10 flex justify-between cursor-pointer'
          onSelect={(event) => {
            event.preventDefault();
            setSettingsModal(true);
          }}
        >
          <span className='mr-2'>Settings</span>
          <CogIcon className='h-5 w-5' />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onHandleLogout}
          className='h-10 flex justify-between cursor-pointer'
        >
          <span className='mr-2'>Logout</span>
          <LogOutIcon className='h-5 w-5' />
        </DropdownMenuItem>
      </DropdownMenuContent>
      <UserSettings open={settingsModal} onOpenChange={setSettingsModal} />
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
