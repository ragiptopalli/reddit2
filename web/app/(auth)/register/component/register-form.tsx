'use client';

import type { RegisterSchemaType } from '@/lib/validation';
import { registerSchema } from '@/lib/validation/';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRegisterUserMutation } from '@/lib/graphql/generated/graphql';
import { useRouter } from 'next/navigation';
import { toErrorMap } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export const RegisterForm = () => {
  const router = useRouter();

  const [register, { loading }] = useRegisterUserMutation();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
    },
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    const { data } = await register({
      variables: {
        options: {
          username: values.username,
          password: values.password,
          email: values.email,
        },
      },
    });
    if (data?.register.errors) {
      toErrorMap(data.register.errors, form.setError);
    } else {
      router.push('/');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormDescription>Your email address!.</FormDescription>
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
              <FormDescription>
                Please choose a strong password!.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type='submit' className='w-full'>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Register
        </Button>
      </form>
      <div className='mt-4 text-center text-sm'>
        Already have an account?
        <Link href='/login' className='underline ml-2'>
          Log In
        </Link>
      </div>
    </Form>
  );
};
