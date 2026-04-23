import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-marketing">
        <h1>FitHub</h1>
        <p>
          Track your nutrition, crush your workouts, and stay accountable with a supportive fitness
          community.
        </p>
      </section>
      <section className="auth-form-wrapper">
        <Outlet />
      </section>
    </main>
  );
}
