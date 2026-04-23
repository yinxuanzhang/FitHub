import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/diet', label: 'Diet' },
  { path: '/workout', label: 'Workout' },
  { path: '/community', label: 'Community' },
  { path: '/profile', label: 'Profile' }
];

export default function ProtectedLayout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>FitHub</h2>
        <nav>
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}
