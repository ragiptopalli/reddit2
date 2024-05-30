'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
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
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import * as React from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface BaseProps {
  children: React.ReactNode;
}

type CommonProps = {
  className?: string;
  asChild?: true;
};

interface RootDialogOrVaulProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type DialogOrVaulProps = BaseProps & CommonProps;

const useResponsiveComponent = (
  desktopComponent: React.ElementType,
  mobileComponent: React.ElementType
) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
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

const DialogOrVaulPortal = ({ children, ...props }: DialogOrVaulProps) => {
  const Component = useResponsiveComponent(DialogPortal, DrawerPortal);
  return <Component {...props}>{children}</Component>;
};

const DialogOrVaulOverlay = ({ className, ...props }: CommonProps) => {
  const Component = useResponsiveComponent(DialogOverlay, DrawerOverlay);
  return <Component className={className} {...props} />;
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

export {
  DialogOrVaul,
  DialogOrVaulClose,
  DialogOrVaulContent,
  DialogOrVaulDescription,
  DialogOrVaulFooter,
  DialogOrVaulHeader,
  DialogOrVaulOverlay,
  DialogOrVaulPortal,
  DialogOrVaulTitle,
  DialogOrVaulTrigger,
};
