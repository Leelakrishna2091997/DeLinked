import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthButton from '@/components/Auth/AuthButton';
import { useAppSelector } from '@/store/hooks';

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">DeLinked</span>
        </h1>

        <p className="mt-3 text-2xl">
          Connect your MetaMask wallet to get started
        </p>

        <div className="mt-6">
          <AuthButton />
        </div>
      </main>
    </div>
  );
};

export default Home;