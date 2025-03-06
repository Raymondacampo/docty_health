// components/ProtectedRoute.js
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  return user ? children : null;
}