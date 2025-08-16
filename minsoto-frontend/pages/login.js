import { useState } from 'react';
import Link from 'next/link';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailPasswordSubmit = (e) => {
    e.preventDefault();
    setError('Sign in with Google is the only available method.');
  };

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* Left Column - Branding & Image */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center p-12 flex-col justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542542682-300c39027993?q=80&w=2574&auto=format&fit=crop')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Minsoto</h1>
          <h2 className="text-3xl font-semibold mb-4">Community, Without the Chaos.</h2>
          <p className="text-lg text-gray-300">
            Minsoto is your focused space to connect with your passions and achieve your goals.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Sign In</h2>
            <p className="text-gray-400 mt-2">Enter your credentials to access your account.</p>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton text="Continue with Google" />
            {/* You can add a GitHub button here later if needed */}
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">
                Username or Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Username or Email"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-md font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/register" className="font-medium text-gray-300 hover:text-white">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;