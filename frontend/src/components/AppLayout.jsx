import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { to: "/program", label: "Program", Icon: ProgramIcon },
  { to: "/body", label: "Body", Icon: BodyIcon },
  { to: "/diet", label: "Diet", Icon: DietIcon },
  { to: "/progress", label: "Progress", Icon: ProgressIcon },
  { to: "/social", label: "Social", Icon: SocialIcon }
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!isAuthenticated && isAuthPage) {
    return (
      <div className="auth-shell">
        <section className="auth-marketing">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">F</div>
            <span className="sidebar-logo-text">FitHub</span>
          </div>
          <h1>Build a fitness rhythm you can actually keep.</h1>
          <p>Plan workouts, track body metrics, manage nutrition, and share progress in one focused space.</p>
          <div className="auth-features">
            <span><i /> Private body records</span>
            <span><i /> Program version history</span>
            <span><i /> Community progress posts</span>
          </div>
        </section>
        <main className="auth-form-wrapper">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">F</div>
          <span className="sidebar-logo-text">FitHub</span>
        </div>
        <nav aria-label="Main navigation">
          {isAuthenticated ? (
            <>
              {navItems.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
                  <Icon />
                  <span className="nav-label">{label}</span>
                </NavLink>
              ))}
              <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                <ProfileIcon />
                <span className="nav-label">Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>Register</NavLink>
            </>
          )}
        </nav>
        {isAuthenticated && (
          <div className="sidebar-footer">
            <div className="nav-user" title={currentUser.name}>
              <Avatar src={currentUser.avatarUrl} name={currentUser.name} />
              <span className="nav-label">{currentUser.name}</span>
            </div>
            <button className="logout-btn" type="button" onClick={handleLogout}>
              <LogoutIcon />
              <span className="nav-label">Logout</span>
            </button>
          </div>
        )}
      </aside>
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

function Avatar({ src, name }) {
  if (src) return <img className="nav-avatar" src={src} alt="" />;
  return <span className="nav-avatar fallback">{name?.charAt(0) || "U"}</span>;
}

function IconFrame({ children }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function DashboardIcon() {
  return <IconFrame><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></IconFrame>;
}

function ProgramIcon() {
  return <IconFrame><path d="M6.5 6.5h1v11h-1zM16.5 6.5h1v11h-1z" /><path d="M3 9h3.5M17.5 9H21M3 15h3.5M17.5 15H21" /><line x1="7.5" y1="12" x2="16.5" y2="12" /></IconFrame>;
}

function BodyIcon() {
  return <IconFrame><path d="M12 3v18" /><path d="M7 7c0 2.5 2 4 5 4s5-1.5 5-4" /><path d="M8 21c0-4 1.5-7 4-7s4 3 4 7" /></IconFrame>;
}

function DietIcon() {
  return <IconFrame><path d="M12 2a7 7 0 0 0-7 7c0 5 5 11 7 13 2-2 7-8 7-13a7 7 0 0 0-7-7z" /><line x1="12" y1="2" x2="12" y2="9" /></IconFrame>;
}

function ProgressIcon() {
  return <IconFrame><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></IconFrame>;
}

function SocialIcon() {
  return <IconFrame><circle cx="9" cy="7" r="3" /><path d="M3 21v-2a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2" /><circle cx="18" cy="9" r="2.5" /><path d="M22 21v-1.5a4.5 4.5 0 0 0-3-4.24" /></IconFrame>;
}

function ProfileIcon() {
  return <IconFrame><circle cx="12" cy="8" r="4" /><path d="M4 20v-1a8 8 0 0 1 16 0v1" /></IconFrame>;
}

function LogoutIcon() {
  return <IconFrame><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></IconFrame>;
}
