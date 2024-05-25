import { AuthContainer } from '../../_components/auth-container';
import { ResetPasswordForm } from './component/reset-password';

export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  return (
    <AuthContainer
      title='Reset Password'
      description='Please enter a new password!'
    >
      <ResetPasswordForm token={params.token} />
    </AuthContainer>
  );
}
