import type { Metadata } from 'next';
import { Fira_Code as FontSans } from 'next/font/google';
import '../styles/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/providers/theme/theme-provider';
import { GraphqlProvider } from '@/providers/apollo/apollo-provider';
import { Toaster } from '@/components/ui/sonner';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Reddit 2',
  description: 'Simple reddit app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head />
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <GraphqlProvider>
            <div vaul-drawer-wrapper='' className='bg-background'>
              {children}
            </div>
          </GraphqlProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
