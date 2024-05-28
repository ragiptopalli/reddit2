const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={'min-h-screen flex flex-col items-center'}>{children}</div>
  );
};

export { Container };
