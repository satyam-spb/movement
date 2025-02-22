import { usePrivy } from '@privy-io/react-auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { authenticated, ready, user } = usePrivy();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('ProtectedRoute - Location:', location.pathname);
    console.log('ProtectedRoute - Ready:', ready);
    console.log('ProtectedRoute - Authenticated:', authenticated);
    console.log('ProtectedRoute - User:', user);

    if (ready) {
      setIsChecking(false);
    }
  }, [ready, authenticated, location, user]);

  if (isChecking) {
    return <div>Loading authentication status...</div>;
  }

  if (!authenticated) {
    console.log('Redirecting to login from:', location.pathname);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;