'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface BaseProps {
  children: React.ReactNode;
}

interface RootDialogOrVaulProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogOrVaulProps extends BaseProps {
  className?: string;
  asChild?: true;
}

const desktop = '(min-width: 768px)';

const useResponsiveComponent = (
  desktopComponent: React.ElementType,
  mobileComponent: React.ElementType
) => {
  const isDesktop = useMediaQuery(desktop);
  return isDesktop ? desktopComponent : mobileComponent;
};

const DialogOrVaul = ({ children, ...props }: RootDialogOrVaulProps) => {
  const Component = useResponsiveComponent(Dialog, Drawer);
  return <Component {...props}>{children}</Component>;
};

const DialogOrVaulTrigger = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogTrigger, DrawerTrigger);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulClose = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogClose, DrawerClose);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulContent = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogContent, DrawerContent);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulDescription = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(
    DialogDescription,
    DrawerDescription
  );
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulHeader = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogHeader, DrawerHeader);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulTitle = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogTitle, DrawerTitle);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

const DialogOrVaulBody = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  return (
    <div className={cn('px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  );
};

const DialogOrVaulFooter = ({
  className,
  children,
  ...props
}: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogFooter, DrawerFooter);
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export {
  DialogOrVaul,
  DialogOrVaulTrigger,
  DialogOrVaulClose,
  DialogOrVaulContent,
  DialogOrVaulDescription,
  DialogOrVaulHeader,
  DialogOrVaulTitle,
  DialogOrVaulBody,
  DialogOrVaulFooter,
};
