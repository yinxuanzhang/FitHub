import { Link } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onRegister();
  };

  return (
    <div className="auth-card">
      <h2>Create your account</h2>
      <p>Start tracking workouts, meals, and streaks.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create password" required />
        </label>
        <label>
          Confirm password
          <input type="password" placeholder="Confirm password" required />
        </label>
        <button type="submit">Register</button>
      </form>
      <p className="switch-auth">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
