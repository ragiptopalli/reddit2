import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from './ui/textarea';
import { Input } from '@/components/ui/input';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createPostSchema } from '@/lib/validation';
import type { CreatePostSchemaType } from '@/lib/validation';

import { useState } from 'react';
import {
  PostsDocument,
  PostsQuery,
  useCreatePostMutation,
} from '@/lib/graphql/generated/graphql';
import { useRouter } from 'next/navigation';
import {
  DialogOrVaul,
  DialogOrVaulContent,
  DialogOrVaulDescription,
  DialogOrVaulFooter,
  DialogOrVaulHeader,
  DialogOrVaulTitle,
  DialogOrVaulTrigger,
} from '@/components/ui/dialog-or-vaul';

export const CreatePostModal = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [createPost, { loading }] = useCreatePostMutation({
    onCompleted() {
      toast.success('Post was created successfully', {
        duration: 1000,
      });
      setOpen(false);
      form.reset({
        title: '',
        text: '',
      });
      router.refresh();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<CreatePostSchemaType>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      text: '',
    },
  });

  const onSubmit = async (values: CreatePostSchemaType) => {
    await createPost({
      variables: {
        input: { ...values },
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
              posts: [data?.createPost, ...existingPosts.posts],
            },
          });
        }
      },
    });
  };
  return (
    <DialogOrVaul open={open} onOpenChange={setOpen}>
      <DialogOrVaulTrigger asChild>
        <Button className='px-2 gap-2' variant='ringHover'>
          Create <PlusCircledIcon className='h-5 w-5' />
        </Button>
      </DialogOrVaulTrigger>
      <DialogOrVaulContent>
        <DialogOrVaulHeader>
          <DialogOrVaulTitle>Create a new post!</DialogOrVaulTitle>
          <DialogOrVaulDescription>
            Write something cool when you&apos;re done just click post.
          </DialogOrVaulDescription>
        </DialogOrVaulHeader>
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
                      <Input
                        type='text'
                        {...field}
                        placeholder="What's on your mind?"
                      />
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
                      <Textarea placeholder='What is happening?!' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type='submit' className='w-full'>
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Post
              </Button>
            </form>
          </Form>
        </div>
        <DialogOrVaulFooter>
          <Alert>
            <Terminal className='h-4 w-4' />
            <AlertTitle>Reminder!</AlertTitle>
            <AlertDescription>
              You can <span>@mention</span> other users.
            </AlertDescription>
          </Alert>
        </DialogOrVaulFooter>
      </DialogOrVaulContent>
    </DialogOrVaul>
  );
};
