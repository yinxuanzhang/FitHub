import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DietPage from './pages/DietPage';
import WorkoutPage from './pages/WorkoutPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authActions = useMemo(
    () => ({
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false)
    }),
    []
  );

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={authActions.login} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage onRegister={authActions.login} />
            )
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProtectedLayout onLogout={authActions.logout} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/diet" element={<DietPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:postId" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}
