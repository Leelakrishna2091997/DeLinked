import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import OrganizerDashboard from '@/components/Dashboard/OrganizerDashboard';
import CandidateDashboard from '@/components/Dashboard/CandidateDashboard';
import { getOrganizerProfile } from '@/store/slices/organizerSlice';
import { getCandidateProfile } from '@/store/slices/candidateSlice';

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    // Fetch profile based on user type
    if (user?.userType === 'organizer') {
      dispatch(getOrganizerProfile());
    } else if (user?.userType === 'candidate') {
      dispatch(getCandidateProfile());
    }
  }, [isAuthenticated, user, dispatch, router]);
  
  // Show loading while checking authentication
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {user?.userType === 'organizer' ? (
        <OrganizerDashboard />
      ) : (
        <CandidateDashboard />
      )}
    </div>
  );
};

export default Dashboard;