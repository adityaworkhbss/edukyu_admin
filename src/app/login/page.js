import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}