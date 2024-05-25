import { AuthContainer } from '../_components/auth-container';
import { LoginForm } from './component/login-form';

export default function Login() {
  return (
    <AuthContainer
      title='Login'
      description='Enter your information below to login to your account'
    >
      <LoginForm />
    </AuthContainer>
  );
}
