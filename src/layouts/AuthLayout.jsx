import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-marketing">
        <div className="auth-marketing-logo">
          <div className="auth-marketing-logo-icon">F</div>
          <span>FitHub</span>
        </div>

        <h1>
          Train smarter.
          <br />
          Live stronger.
        </h1>

        <p>
          Track your nutrition, crush your workouts, and stay accountable with a
          community that actually shows up.
        </p>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Precision macro &amp; calorie tracking
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Workout logging with volume analytics
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Streak system to keep you consistent
          </div>
          <div className="auth-feature">
            <span className="auth-feature-dot" />
            Community feed for daily motivation
          </div>
        </div>
      </section>

      <section className="auth-form-wrapper">
        <Outlet />
      </section>
    </main>
  );
}
