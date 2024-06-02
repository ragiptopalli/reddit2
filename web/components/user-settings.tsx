'use client';

import {
  DialogOrVaul,
  DialogOrVaulContent,
} from '@/components/ui/dialog-or-vaul';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from './profile-form-setting';
import { AccountForm } from './account-form';
import { AppearanceForm } from './appearance-form';

export const UserSettings = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  return (
    <DialogOrVaul open={open} onOpenChange={onOpenChange}>
      <DialogOrVaulContent className='space-y-6 p-1 max-w-3xl h-[70%]'>
        <LayoutSettings />
      </DialogOrVaulContent>
    </DialogOrVaul>
  );
};

const LayoutSettings = () => {
  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>Manage your account settings.</p>
      </div>
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-6'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='appearance'>Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium'>Profile</h3>
              <p className='text-sm text-muted-foreground'>
                This is how others will see you on the site.
              </p>
            </div>
            <Separator />
            <ProfileForm />
          </div>
        </TabsContent>
        <TabsContent value='account'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium'>Account</h3>
              <p className='text-sm text-muted-foreground'>
                Update your account information and settings.
              </p>
            </div>
            <Separator />
            <AccountForm />
          </div>
        </TabsContent>
        <TabsContent value='appearance'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium'>Appearance</h3>
              <p className='text-sm text-muted-foreground'>
                Customize the look and feel of your account.
              </p>
            </div>
            <Separator />
            <AppearanceForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
