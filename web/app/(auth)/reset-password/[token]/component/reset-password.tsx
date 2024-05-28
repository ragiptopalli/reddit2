'use client';

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
import { resetPasswordSchema } from '@/lib/validation';
import type { ResetPasswordSchemaType } from '@/lib/validation';
import {
  MeDocument,
  MeQuery,
  useResetPasswordMutation,
} from '@/lib/graphql/generated/graphql';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ApolloError } from '@apollo/client';

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState<ApolloError>();

  const [resetPassword] = useResetPasswordMutation({
    onCompleted() {
      toast.success(
        'Password reset was successful, redirecting to homepage...',
        { position: 'top-center', duration: 2500 }
      );
      router.push('/');
    },
    onError(error) {
      setTokenError(error);
      toast.error(error.message, { position: 'top-center' });
    },
  });

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    await resetPassword({
      variables: {
        newPassword: values.newPassword,
        token,
      },
      update(cache, { data }) {
        const existing = cache.readQuery<MeQuery>({
          query: MeDocument,
        });

        if (!existing || !data?.resetPassword) return;

        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: existing.me || data.resetPassword,
          },
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder='*********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </form>
      {!tokenError ? null : (
        <div className='mt-4 text-center text-sm'>
          <Link href='/forgot-password' className='underline ml-2'>
            Reset it again?
          </Link>
        </div>
      )}
    </Form>
  );
};
