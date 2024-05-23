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

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  type ForgotPasswordSchemaType,
  forgotPasswordSchema,
} from '@/lib/formSchemaValidation/forgot-password.schema';
import { useForgetPasswordMutation } from '@/lib/graphql/generated/graphql';

export const ForgotPasswordForm = () => {
  const router = useRouter();

  const [forgotPassword] = useForgetPasswordMutation({
    onCompleted() {
      toast.success(
        'If an account with that email exists, we have sent you an email!',
        {
          position: 'top-center',
          duration: 2500,
        }
      );
      router.push('/');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    await forgotPassword({
      variables: {
        email: values.email,
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
        noValidate
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='john@doe.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Reset Password
        </Button>
      </form>
    </Form>
  );
};
