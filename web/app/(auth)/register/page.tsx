import { AuthContainer } from '../_components/auth-container';
import { RegisterForm } from './component/register-form';

export default function Login() {
  return (
    <AuthContainer
      title='Sign Up'
      description='Enter your information below to create an account'
    >
      <RegisterForm />
    </AuthContainer>
  );
}
