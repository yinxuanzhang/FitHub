import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "alex@example.com", password: "password123" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(location.state?.from || "/dashboard", { replace: true });
  }

  return (
    <div className="page-stack auth-page">
      <PageHeader eyebrow="Welcome back" title="Login" description="Use your account to access private fitness data." />
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        </label>
        <button className="button primary" type="submit">Login</button>
        <p className="muted-copy">Need an account? <Link className="inline-link" to="/register">Register</Link></p>
      </form>
    </div>
  );
}
