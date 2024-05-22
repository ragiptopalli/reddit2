const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className={
        'min-h-screen mx-auto flex flex-col items-center justify-between'
      }
    >
      {children}
    </div>
  );
};

export { Container };
