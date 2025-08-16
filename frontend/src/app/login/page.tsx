"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const login = useAuthStore(s => s.login);
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    // Note: The backend uses 'email' for authentication method
    const result = await login(email, password);
    if (result.success) {
      router.push('/'); // Redirect to homepage on success
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    // dj-rest-auth uses the 'access_token', which is the id_token from Google
    const idToken = credentialResponse.credential;
    if (idToken) {
      const result = await loginWithGoogle(idToken);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Google login failed.');
      }
    } else {
      handleGoogleError();
    }
  };

  const handleGoogleError = () => {
    setError('Google login was unsuccessful. Please try again.');
  };

  return (
    <main className="flex min-h-screen bg-black">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-center w-1/2 p-12 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 filter grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2615&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Minsoto</h1>
          <h2 className="text-4xl font-bold mb-4">Community, Without the Chaos.</h2>
          <p className="text-gray-300">
            Minsoto is your focused space to connect with your passions and achieve your goals.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-black p-8 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-left mb-10">
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <p className="text-gray-400">Enter your credentials to access your account.</p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              text="continue_with"
              shape="rectangular"
              width="384" // Max width of the container
            />
            {/* You can add Github login later */}
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-xs font-medium text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
              >
                Sign In
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/register" className="font-medium text-gray-300 hover:text-white">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}