'use client';

import { useState, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, PencilRulerIcon, TrashIcon } from 'lucide-react';
import UpdatePost from './update-post';

type P = {
  postId: string;
  postTitle: string;
  postText?: string | null;
};

export const DropdownActions = ({ postId, postTitle, postText }: P) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef<null | HTMLButtonElement>(null);
  const focusRef = useRef<null | HTMLButtonElement>(null);

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-7 w-7 p-0'>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-40'
        align='end'
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DialogItem
          triggerChildren={
            <>
              <TrashIcon className='mr-2 h-4 w-4' />
              <span>Delete Post</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogTitle className='DialogTitle'>Delete</DialogTitle>
          <DialogDescription className='DialogDescription'>
            Are you sure you want to delete this post?
          </DialogDescription>
          <DialogFooter>
            <Button type='submit'>Delete</Button>
          </DialogFooter>
        </DialogItem>
        <DialogItem
          triggerChildren={
            <>
              <PencilRulerIcon className='mr-2 h-4 w-4' />
              <span>Edit Post</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogTitle className='DialogTitle'>Edit</DialogTitle>
          <UpdatePost
            postId={postId}
            postTitle={postTitle}
            postText={postText}
            setHasOpenDialog={setHasOpenDialog}
          />
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type Props = {
  triggerChildren: ReactNode;
  children: ReactNode;
  onSelect: () => void;
  onOpenChange: (open: boolean) => void;
};

const DialogItem = ({
  triggerChildren,
  children,
  onSelect,
  onOpenChange,
}: Props) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className='p-3'
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>{children}</DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
