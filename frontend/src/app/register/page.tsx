"use client";

import { useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // State for confirm password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const register = useAuthStore(s => s.register);
  const loginWithGoogle = useAuthStore(s => s.loginWithGoogle);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const result = await register(email, username, password, password2);

    if (result.success) {
      setSuccess('Registration successful! Please check your email to verify your account.');
    } else {
      setError(result.error || 'Registration failed.');
    }
  };
  
  // You can reuse the Google login logic from the login page
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (idToken) {
      const result = await loginWithGoogle(idToken);
      if (result.success) {
        window.location.href = '/'; // Redirect to homepage
      } else {
        setError(result.error || 'Google sign-up failed.');
      }
    }
  };

  return (
    <main className="flex min-h-screen bg-black">
      {/* Left Panel - Same as login */}
      <div className="hidden md:flex flex-col justify-center w-1/2 p-12 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20 filter grayscale"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2615&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Minsoto</h1>
          <h2 className="text-4xl font-bold mb-4">Community, Without the Chaos.</h2>
          <p className="text-gray-300">
            Join a focused space to connect with your passions and achieve your goals.
          </p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-black p-8 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-left mb-10">
            <h1 className="text-3xl font-bold text-white">Create an Account</h1>
            <p className="text-gray-400">Join Minsoto to start focusing on your goals.</p>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-up was unsuccessful.')}
              theme="filled_black" text="signup_with" shape="rectangular" width="384"
            />
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-xs font-medium text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Show success message or registration form */}
          {success ? (
            <div className="text-center p-4 bg-gray-900 border border-gray-700 rounded-md">
                <h2 className="text-xl font-semibold text-white">Verification Email Sent!</h2>
                <p className="text-gray-400 mt-2">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"/>
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"/>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"/>
              </div>
              {/* Confirm Password Field */}
              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                <input id="password2" type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"/>
              </div>

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-200">
                  Create Account
                </button>
              </div>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-gray-500">
            Already a member?{' '}
            <Link href="/login" className="font-medium text-gray-300 hover:text-white">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}