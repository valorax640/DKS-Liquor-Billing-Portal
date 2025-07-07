// project imports
import CommonAuthLayout from './CommonAuthLayout';
import AuthLogin from 'sections/auth/AuthLogin';

// ==============================|| LOGIN ||============================== //

export default function Login() {
  return (
    <CommonAuthLayout
      title="Sign in"
      subHeading="Already have an account?"
      footerLink={{ title: 'Create a new account', link: '/register' }}
    >
      {/* Login form */}
      <AuthLogin />
    </CommonAuthLayout>
  );
}
