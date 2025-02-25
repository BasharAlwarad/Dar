import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStates } from '../hooks/useAuthStates';
import { Spinner } from '../components';

export const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStates();

  if (checkingStatus) return <Spinner />;

  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};
