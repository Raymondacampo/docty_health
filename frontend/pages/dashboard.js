import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/auth';

function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <h1>Welcome {user?.email}</h1>
    </ProtectedRoute>
  );
}