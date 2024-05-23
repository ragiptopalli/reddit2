'use client';

import {
  loginSchema,
  type LoginSchemaType,
} from '@/lib/formSchemaValidation/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  useLoginMutation,
  MeDocument,
  MeQuery,
} from '@/lib/graphql/generated/graphql';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const LoginForm = () => {
  const router = useRouter();

  const [login] = useLoginMutation({
    onCompleted() {
      toast.success('Logged in successfully, redirecting...', {
        duration: 1000,
      });
      router.push('/');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async ({ usernameOrEmail, password }: LoginSchemaType) => {
    await login({
      variables: {
        password,
        usernameOrEmail,
      },
      update(cache, { data }) {
        const existing = cache.readQuery<MeQuery>({
          query: MeDocument,
        });

        if (!existing || !data?.login) return;

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: existing.me || data.login,
          },
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (values) => {
          console.log(values);
        })}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='usernameOrEmail'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Log In
        </Button>
      </form>
      <div className='mt-4 text-center text-sm'>
        <Link href='/forgot-password' className='underline ml-2'>
          Forgot Password?
        </Link>
      </div>
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?
        <Link href='/register' className='underline ml-2'>
          Register
        </Link>
      </div>
    </Form>
  );
};
