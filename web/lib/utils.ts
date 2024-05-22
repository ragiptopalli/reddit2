import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { RegisterSchemaType } from './formSchemaValidation/register.schema';
import type { FieldError } from './graphql/generated/graphql';
import { UseFormSetError } from 'react-hook-form';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isFieldKey = (key: string): key is keyof RegisterSchemaType => {
  return key === 'username' || key === 'password';
};

export function toErrorMap(
  errors: FieldError[],
  setError: UseFormSetError<RegisterSchemaType>
) {
  errors.forEach((error) => {
    if (isFieldKey(error.field)) {
      setError(error.field, {
        type: 'manual',
        message: error.message,
      });
    }
  });
}
