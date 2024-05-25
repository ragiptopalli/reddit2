import Footer from '@/components/footer';
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
      <main>{children}</main>
      <Footer />
    </Container>
  );
}
