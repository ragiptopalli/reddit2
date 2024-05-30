import Footer from '@/components/footer';
import { Header } from '@/components/header';
import { Container } from '@/components/ui/container';
import { RightSidebar } from './_compontents/right-sidebar';
import { LeftSidebar } from './_compontents/left-sidebar';

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <Header />
      <main className='w-full'>
        <div className='container px-1 grid grid-cols-4 gap-4 mt-4 max-w-screen-xl'>
          <div className='hidden md:block h-fit bg-background rounded-xl border'>
            <LeftSidebar />
          </div>
          {children}
          <div className='hidden md:block h-fit bg-background rounded-xl border'>
            <RightSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
}
