import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const DietIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 0-7 7c0 5 5 11 7 13 2-2 7-8 7-13a7 7 0 0 0-7-7z" />
    <line x1="12" y1="2" x2="12" y2="9" />
  </svg>
);

const WorkoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h1v11h-1zM16.5 6.5h1v11h-1z" />
    <path d="M3 9h3.5M17.5 9H21M3 15h3.5M17.5 15H21" />
    <line x1="7.5" y1="12" x2="16.5" y2="12" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2" />
    <circle cx="18" cy="9" r="2.5" />
    <path d="M22 21v-1.5a4.5 4.5 0 0 0-3-4.24" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20v-1a8 8 0 0 1 16 0v1" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { path: '/diet', label: 'Diet', Icon: DietIcon },
  { path: '/workout', label: 'Workout', Icon: WorkoutIcon },
  { path: '/community', label: 'Community', Icon: CommunityIcon },
  { path: '/profile', label: 'Profile', Icon: ProfileIcon },
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
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">F</div>
          <span className="sidebar-logo-text">FitHub</span>
        </div>

        <nav>
          {navLinks.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      <div className="content-area">
        <Outlet />
      </div>
    </div>
  );
}
