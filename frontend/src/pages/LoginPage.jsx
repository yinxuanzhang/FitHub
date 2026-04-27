import { Link } from 'react-router-dom';
import axios from 'axios';
export default function LoginPage({ onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin();
  };
 async function sendUserInfromation() {
   await axios.get('http://localhost:3000/api/users');
 }
 console.log(sendUserInfromation());
  return (
    <div className="auth-card">
      <h2>Welcome back</h2>
      <p>Sign in to continue your fitness journey.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••••" required />
        </label>
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Sign In →
        </button>
      </form>

      <p className="switch-auth">
        New to FitHub?&nbsp;
        <Link to="/register">Create account</Link>
      </p>
    </div>
  );
}
