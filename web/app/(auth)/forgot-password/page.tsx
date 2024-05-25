import { AuthContainer } from '../_components/auth-container';
import { ForgotPasswordForm } from './component/forgot-password';

export default function ResetPassword() {
  return (
    <AuthContainer
      title='Forgot Password?'
      description='Please enter your email address below to recieve a link'
    >
      <ForgotPasswordForm />
    </AuthContainer>
  );
}
