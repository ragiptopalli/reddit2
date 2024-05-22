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
import { useLoginMutation } from '@/lib/graphql/generated/graphql';
import { useRouter } from 'next/navigation';
import { toErrorMap } from '@/lib/utils';

export const LoginForm = () => {
  const router = useRouter();

  const [login] = useLoginMutation();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async ({ username, password }: LoginSchemaType) => {
    const { data } = await login({
      variables: {
        options: {
          username,
          password,
        },
      },
    });
    if (data?.login.errors) {
      toErrorMap(data.login.errors, form.setError);
    } else {
      router.push('/');
    }
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
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
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
        Don&apos;t have an account?
        <Link href='/register' className='underline ml-2'>
          Register
        </Link>
      </div>
    </Form>
  );
};
