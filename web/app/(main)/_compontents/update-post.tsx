'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { UpdatePostSchemaType } from '@/lib/validation';
import { updatePostSchema } from '@/lib/validation';
import { Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PostsDocument,
  PostsQuery,
  useUpdatePostMutation,
} from '@/lib/graphql/generated/graphql';
import { toast } from 'sonner';

type P = {
  postId: string;
  postTitle: string;
  postText?: string | null;
  onHandleEditDialogOpen: (value: boolean) => void;
};

export default function UpdatePost({
  postId,
  postTitle,
  postText,
  onHandleEditDialogOpen,
}: P) {
  const [updatePost, { loading }] = useUpdatePostMutation({
    onCompleted() {
      toast.success('Post was updated successfully', {
        duration: 1000,
      });
      onHandleEditDialogOpen(false);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<UpdatePostSchemaType>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: postTitle,
      text: postText ?? '',
    },
  });

  const onSubmit = async (values: UpdatePostSchemaType) => {
    updatePost({
      variables: {
        id: postId,
        title: values.title,
        text: values.text,
      },
      update: (cache, { data }) => {
        const existingPosts = cache.readQuery<PostsQuery>({
          query: PostsDocument,
          variables: {
            take: 10,
            skip: 0,
          },
        });

        if (existingPosts) {
          cache.writeQuery({
            query: PostsDocument,
            variables: {
              take: 10,
              skip: 0,
            },
            data: {
              posts: [data?.updatePost, ...existingPosts.posts],
            },
          });
        }
      },
    });
  };

  return (
    <div className='grid gap-4 py-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='text'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea className='resize-none' {...field} rows={8} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type='submit' className='w-full'>
            {loading && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
            Update post
          </Button>
        </form>
      </Form>
    </div>
  );
}
