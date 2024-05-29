// import Footer from '@/components/footer';
import { Header } from '@/components/header';
import { Container } from '@/components/ui/container';

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <Header />
      <main className='w-full'>
        <div className='container flex gap-4 justify-between mt-4 max-w-screen-xl'>
          <div className='w-[380px] h-[380px] bg-background rounded-xl border'>
            Something cool is coming...
          </div>
          {children}
          <div className='w-[380px] h-[380px] bg-background rounded-xl border'>
            something cool is coming...
          </div>
        </div>
      </main>
      {/* TODO: add footer to the side <Footer /> */}
    </Container>
  );
}
