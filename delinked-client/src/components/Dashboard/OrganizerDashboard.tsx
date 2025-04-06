import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { getOrganizerProfile } from '@/store/slices/organizerSlice';
import Link from 'next/link';

const OrganizerDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.auth);
  const { profile, loading } = useAppSelector(state => state.organizer);

  useEffect(() => {
    if (user?.userType === 'organizer') {
      dispatch(getOrganizerProfile());
    }
  }, [dispatch, user]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-2">Hi Organizer</h2>
        <p className="text-gray-600">
          Welcome to your DeLinked dashboard
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Profile Status</h3>
        {profile?.profileCompleted ? (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md">
            Your profile is complete
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md">
            Your profile is incomplete
            <Link href="/organizer/profile" className="ml-2 underline">
              Complete now
            </Link>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Account Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">Wallet Address:</p>
              <p className="font-mono">{user?.address}</p>
            </div>
            {profile?.name && (
              <div>
                <p className="text-gray-600 mb-1">Name:</p>
                <p>{profile.name}</p>
              </div>
            )}
            {profile?.organizationName && (
              <div>
                <p className="text-gray-600 mb-1">Organization:</p>
                <p>{profile.organizationName}</p>
              </div>
            )}
            {profile?.email && (
              <div>
                <p className="text-gray-600 mb-1">Email:</p>
                <p>{profile.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link 
          href="/organizer/profile" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default OrganizerDashboard;