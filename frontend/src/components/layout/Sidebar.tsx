import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <h3>Help-desk</h3>

      <Link to="/">Dashboard</Link>
      <Link to="/tickets">Tickets</Link>
      <Link to="/departments">Departments</Link>

      {user?.role === 'ADMIN' && <Link to="/users">Users</Link>}

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};