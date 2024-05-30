'use client';

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
import * as React from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface BaseProps {
  readonly children: React.ReactNode;
}

type CommonProps = {
  readonly className?: string;
  readonly asChild?: true;
};

interface RootDialogOrVaulProps extends BaseProps {
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
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

const DialogOrVaulTitle = React.forwardRef<HTMLElement, DialogOrVaulProps>(
  ({ className, children, ...props }, ref) => {
    const Component = useResponsiveComponent(DialogTitle, DrawerTitle);
    return (
      <Component className={className} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);
DialogOrVaulTitle.displayName = 'DialogOrVaulTitle';

const DialogOrVaulDescription = React.forwardRef<
  HTMLElement,
  DialogOrVaulProps
>(({ className, children, ...props }, ref) => {
  const Component = useResponsiveComponent(
    DialogDescription,
    DrawerDescription
  );
  return (
    <Component className={className} ref={ref} {...props}>
      {children}
    </Component>
  );
});
DialogOrVaulDescription.displayName = 'DialogOrVaulDescription';

export {
  DialogOrVaul,
  DialogOrVaulTrigger,
  DialogOrVaulClose,
  DialogOrVaulContent,
  DialogOrVaulHeader,
  DialogOrVaulFooter,
  DialogOrVaulDescription,
  DialogOrVaulTitle,
};
