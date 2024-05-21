import type { Metadata } from 'next';
import { Fira_Code as FontSans } from 'next/font/google';
import '../styles/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GraphqlProvider } from '@/lib/apollo/Apollo';
import { Toaster } from '@/components/ui/toaster';

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
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <GraphqlProvider>
            <div
              className={
                'min-h-screen mx-auto flex flex-col items-center justify-between'
              }
            >
              <Header />
              {children}
              <Footer />
            </div>
          </GraphqlProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
