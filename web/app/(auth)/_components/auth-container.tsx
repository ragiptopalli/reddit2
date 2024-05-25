export function AuthContainer({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        <p className='text-balance text-muted-foreground'>{description}</p>
      </div>
      <div className='grid gap-4'>{children}</div>
    </>
  );
}
