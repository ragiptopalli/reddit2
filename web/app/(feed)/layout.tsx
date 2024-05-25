import Footer from '@/components/footer';
import { Header } from '@/components/header';
import { Container } from '@/components/ui/container';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container>
      <Header />
      <main>{children}</main>
      <Footer />
    </Container>
  );
};

export default DashboardLayout;
