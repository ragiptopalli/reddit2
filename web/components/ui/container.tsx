'use client';

import { useState, useEffect } from 'react';

const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <div className={'min-h-screen flex flex-col items-center'}>{children}</div>
  );
};

export { Container };
