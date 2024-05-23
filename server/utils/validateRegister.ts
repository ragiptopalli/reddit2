import { UsernamePasswordInput } from 'src/types';

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Invalid email!',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Cannot use an @ sign for username!',
      },
    ];
  }

  if (options.username.length < 2) {
    return [
      {
        field: 'username',
        message: 'Username should be at least 2 characters long!',
      },
    ];
  }

  if (options.password.length < 3) {
    return [
      {
        field: 'password',
        message: 'Password should be at least 3 characters long!',
      },
    ];
  }

  return null;
};
