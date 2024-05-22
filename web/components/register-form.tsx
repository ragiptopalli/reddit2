'use client';

import {
  registerSchema,
  type RegisterSchemaType,
} from '@/lib/formSchemaValidation/register.schema';
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
import { useToast } from './ui/use-toast';
import { useRegisterUserMutation } from '@/lib/graphql/generated/graphql';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [register] = useRegisterUserMutation();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterSchemaType) => {
    const { data } = await register({
      variables: {
        options: {
          username: values.username,
          password: values.password,
        },
      },
    });
    if (data?.register.errors) {
      toast({
        variant: 'destructive',
        title: 'Username',
        description: data.register.errors.at(0)?.message ?? '',
      });
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
        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </form>
      <div className='mt-4 text-center text-sm'>
        Already have an account?
        <Link href='/signin' className='underline ml-2'>
          Sign in
        </Link>
      </div>
    </Form>
  );
};
