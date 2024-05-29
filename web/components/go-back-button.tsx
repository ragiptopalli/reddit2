'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function GoBackButton() {
  const router = useRouter();
  return (
    <Button
      variant='expandIcon'
      iconPlacement='left'
      Icon={ArrowLeftIcon}
      onClick={() => router.back()}
    >
      Go Back
    </Button>
  );
}
