import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            DeLinked
          </Link>
        </div>

        <nav>
          <ul className="flex space-x-6">
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/dashboard" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                </li>
                
                {user?.userType === 'organizer' && (
                  <li>
                    <Link href="/organizer/profile" className="hover:text-blue-200">
                      Profile
                    </Link>
                  </li>
                )}
                
                {user?.userType === 'candidate' && (
                  <li>
                    <Link href="/candidate/profile" className="hover:text-blue-200">
                      Profile
                    </Link>
                  </li>
                )}
                
                <li>
                    <button
                        onClick={handleLogout}
                        className="hover:text-blue-200"
                    >
                    Logout
                    </button>
                    <button
                    onClick={handleLogout}
                    className="hover:text-blue-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/" className="hover:text-blue-200">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;