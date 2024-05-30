'use client';

import { useState, ReactNode } from 'react';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const router = useRouter();

  const [deletePost, { loading: deleteLoading }] = useDeletePostMutation({
    onCompleted() {
      toast.success('Post was deleted successfully', { duration: 1000 });
      handleDeleteDialogOpen(false);
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleEditDialogOpen = (value: boolean) => {
    setEditDialogOpen(value);
  };

  const handleDeleteDialogOpen = (value: boolean) => {
    setDeleteDialogOpen(value);
  };

  const handleDeletePost = async () => {
    await deletePost({
      variables: {
        id: postId,
      },
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-7 w-7 p-0'>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        <DialogItem
          triggerChildren={
            <>
              <TrashIcon className='mr-2 h-4 w-4' />
              <span>Delete</span>
            </>
          }
          onSelect={() => handleDeleteDialogOpen(true)}
          open={deleteDialogOpen}
          onClose={() => handleDeleteDialogOpen(false)}
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
          onSelect={() => handleEditDialogOpen(true)}
          open={editDialogOpen}
          onClose={() => handleEditDialogOpen(false)}
        >
          <DialogOrVaulTitle>Edit Post</DialogOrVaulTitle>
          <UpdatePost
            postId={postId}
            postTitle={postTitle}
            postText={postText}
            onHandleEditDialogOpen={handleEditDialogOpen}
          />
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type DialogItemProps = {
  triggerChildren: ReactNode;
  children: ReactNode;
  onSelect?: () => void;
  open: boolean;
  onClose: () => void;
};

const DialogItem = ({
  triggerChildren,
  children,
  onSelect,
  open,
  onClose,
}: DialogItemProps) => {
  return (
    <DialogOrVaul open={open} onOpenChange={onClose}>
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
      </DialogOrVaulDescription>
      <Alert className='mt-2 flex gap-4'>
        <span>
          <TriangleAlertIcon className='h-8 w-8' />
        </span>
        <div>
          <AlertTitle>Careful!</AlertTitle>
          <AlertDescription>This action is irreversible!.</AlertDescription>
        </div>
      </Alert>
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
