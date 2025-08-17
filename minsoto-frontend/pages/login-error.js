// minsoto-frontend/pages/login-error.js

import Link from 'next/link';

const LoginErrorPage = () => {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Login Failed</h1>
      <p className="text-lg text-gray-300 mb-8">
        An unexpected error occurred on the server. Please try again in a moment.
      </p>
      <Link href="/login" className="px-6 py-3 rounded-md font-medium text-black bg-white hover:bg-gray-200">
        Return to Login
      </Link>
    </main>
  );
};

export default LoginErrorPage;