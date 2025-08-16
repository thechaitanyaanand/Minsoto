import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth(); // Get user and logout from context

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome to your Minsoto Dashboard!</h1>
        {user && (
          <div>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
          </div>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;