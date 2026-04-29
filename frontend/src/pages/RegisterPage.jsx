import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="page-stack auth-page">
      <PageHeader eyebrow="Create account" title="Register" description="Create a user-owned fitness data workspace." />
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
        </label>
        <button className="button primary" type="submit">Create account</button>
        <p className="muted-copy">Already registered? <Link className="inline-link" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
