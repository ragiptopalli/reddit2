'use client';

import { useState } from 'react';
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
  DialogOrVaulClose,
  DialogOrVaulContent,
  DialogOrVaulDescription,
  DialogOrVaulFooter,
  DialogOrVaulHeader,
  DialogOrVaulTitle,
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
      setDeleteDialogOpen(false);
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleDeletePost = async () => {
    await deletePost({
      variables: {
        id: postId,
      },
      // TODO: update the cache after the post is deleted
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
        <DropdownMenuItem
          className='p-3'
          onSelect={(event) => {
            event.preventDefault();
            setDeleteDialogOpen(true);
          }}
        >
          <TrashIcon className='mr-2 h-4 w-4' />
          <span>Delete</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='p-3'
          onSelect={(event) => {
            event.preventDefault();
            setEditDialogOpen(true);
          }}
        >
          <PencilRulerIcon className='mr-2 h-4 w-4' />
          <span>Edit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DialogOrVaul open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogOrVaulContent className='space-y-6'>
          <DialogOrVaulHeader>
            <DialogOrVaulTitle className='mt-5'>Delete Post</DialogOrVaulTitle>
            <DialogOrVaulDescription>
              Are you sure you want to delete this post?
            </DialogOrVaulDescription>
          </DialogOrVaulHeader>
          <div>
            <Alert className='mt-2 flex gap-4'>
              <span>
                <TriangleAlertIcon className='text-destructive h-8 w-8' />
              </span>
              <div className='text-destructive'>
                <AlertTitle>Careful!</AlertTitle>
                <AlertDescription>
                  This action is irreversible!.
                </AlertDescription>
              </div>
            </Alert>
          </div>
          <DialogOrVaulFooter>
            <DialogOrVaulClose asChild>
              <Button variant='outline'>Close</Button>
            </DialogOrVaulClose>
            <Button
              onClick={handleDeletePost}
              disabled={deleteLoading}
              type='submit'
            >
              {deleteLoading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Delete
            </Button>
          </DialogOrVaulFooter>
        </DialogOrVaulContent>
      </DialogOrVaul>
      <DialogOrVaul open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogOrVaulContent>
          <DialogOrVaulTitle>Edit Post</DialogOrVaulTitle>
          <UpdatePost
            onHandleEditDialogOpen={setEditDialogOpen}
            postId={postId}
            postTitle={postTitle}
            postText={postText}
          />
        </DialogOrVaulContent>
      </DialogOrVaul>
    </DropdownMenu>
  );
};
