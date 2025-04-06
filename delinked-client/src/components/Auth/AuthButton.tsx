import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { connectWalletThunk, login, logout } from '@/store/slices/authSlice';

const AuthButton = () => {
  const [userTypeSelection, setUserTypeSelection] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, address, isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Handle MetaMask events
    if (typeof window !== 'undefined' && window.ethereum) {
      // Handle account changes
      window.ethereum.on('accountsChanged', () => {
        dispatch(logout());
        router.push('/');
      });
      
      // Handle chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [dispatch, router]);

  const handleConnectWallet = async () => {
    try {
      await dispatch(connectWalletThunk()).unwrap();
      
      // Check if user exists with this address
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/nonce/${address}`);
      const data = await response.json();
      
      if (data.isNewUser) {
        setUserTypeSelection(true);
      } else {
        await dispatch(login({})).unwrap();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleUserTypeSelection = async (userType: 'organizer' | 'candidate') => {
    try {
      await dispatch(login({ userType })).unwrap();
      setUserTypeSelection(false);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Already authenticated
  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-lg font-medium">
          {user.userType === 'organizer' ? 'Hi Organizer' : 'Hi Candidate'}
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  // Show user type selection
  if (userTypeSelection) {
    return (
      <div className="flex flex-col items-center">
        <div className="mb-4 text-lg font-medium">Choose your role:</div>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUserTypeSelection('organizer')}
            disabled={loading}
          >
            Organizer
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUserTypeSelection('candidate')}
            disabled={loading}
          >
            Candidate
          </button>
        </div>
      </div>
    );
  }

  // Not connected yet
  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleConnectWallet}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
      {address && (
        <div className="mt-2 text-sm">
          Connected: {`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </div>
      )}
    </div>
  );
};

export default AuthButton;