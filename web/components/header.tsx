'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

import Link from 'next/link';

const NavLink = ({ href, text }: { href: string; text: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle()}
        active={isActive}
      >
        {text}
      </NavigationMenuLink>
    </Link>
  );
};

export const Header = () => {
  return (
    <header className='mx-auto flex w-full max-w-[700px] items-center justify-between mt-5'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavLink href='/' text='Home' />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavLink href='/about' text='About' />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavLink href='/register' text='Register' />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ThemeToggle />
    </header>
  );
};
