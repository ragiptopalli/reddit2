'use client';

import { useState, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EllipsisVerticalIcon,
  Loader2,
  PencilRulerIcon,
  TrashIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import UpdatePost from './update-post';
import {
  DialogOrVaul,
  DialogOrVaulContent,
  DialogOrVaulDescription,
  DialogOrVaulFooter,
  DialogOrVaulTitle,
  DialogOrVaulTrigger,
} from '@/components/ui/dialog-or-vaul';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useDeletePostMutation } from '@/lib/graphql/generated/graphql';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const [deletePost, { loading: deleteLoading }] = useDeletePostMutation({
    onCompleted() {
      toast.success('Post was deleted successfully', {
        duration: 1000,
      });
      router.refresh();
      setHasOpenDialog(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
    }
  };

  const handleDeletePost = async () => {
    await deletePost({
      variables: {
        id: postId,
      },
    });
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
              <span>Delete</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DeletePost
            onHandleDeletePost={handleDeletePost}
            deleteLoading={deleteLoading}
          />
        </DialogItem>
        <DialogItem
          triggerChildren={
            <>
              <PencilRulerIcon className='mr-2 h-4 w-4' />
              <span>Edit</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogOrVaulTitle>Edit Post</DialogOrVaulTitle>
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
    <DialogOrVaul onOpenChange={onOpenChange}>
      <DialogOrVaulTrigger asChild>
        <DropdownMenuItem
          className='p-3'
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogOrVaulTrigger>
      <DialogOrVaulContent>{children}</DialogOrVaulContent>
    </DialogOrVaul>
  );
};

const DeletePost = ({
  onHandleDeletePost,
  deleteLoading,
}: {
  onHandleDeletePost: () => void;
  deleteLoading: boolean;
}) => {
  return (
    <>
      <DialogOrVaulTitle>Delete Post</DialogOrVaulTitle>
      <DialogOrVaulDescription>
        Are you sure you want to delete this post?
        <Alert className='mt-2 flex gap-4'>
          <span>
            <TriangleAlertIcon className='h-8 w-8' />
          </span>
          <div>
            <AlertTitle>Careful!</AlertTitle>
            <AlertDescription>This action is irreversible!.</AlertDescription>
          </div>
        </Alert>
      </DialogOrVaulDescription>
      <DialogOrVaulFooter>
        <Button
          onClick={onHandleDeletePost}
          disabled={deleteLoading}
          type='submit'
        >
          {deleteLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Delete
        </Button>
      </DialogOrVaulFooter>
    </>
  );
};
