import { Link } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister();
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <p>Start tracking workouts, meals, and streaks today.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create a strong password" required />
        </label>
        <label>
          Confirm password
          <input type="password" placeholder="Confirm password" required />
        </label>
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Get Started →
        </button>
      </form>

      <p className="switch-auth">
        Already have an account?&nbsp;
        <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
