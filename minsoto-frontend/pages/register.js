import Link from 'next/link';
import GoogleLoginButton from '../components/GoogleLoginButton';

const RegisterPage = () => {
  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* Left Column - Branding & Image */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center p-12 flex-col justify-center"
        style={{ backgroundImage: "url('[https://images.unsplash.com/photo-1542542682-300c39027993?q=80&w=2574&auto=format&fit=crop](https://images.unsplash.com/photo-1542542682-300c39027993?q=80&w=2574&auto=format&fit=crop)')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Minsoto</h1>
          <h2 className="text-3xl font-semibold mb-4">Community, Without the Chaos.</h2>
          <p className="text-lg text-gray-300">
            Minsoto is your focused space to connect with your passions and achieve your goals.
          </p>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <p className="text-gray-400 mt-2">Join the Minsoto community to get started.</p>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton text="Continue with Google" />
            {/* Placeholder for other sign-up methods */}
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Already a member?{' '}
            <Link href="/login" className="font-medium text-gray-300 hover:text-white">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;