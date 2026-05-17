import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: currentUser.name,
    avatarUrl: currentUser.avatar || "",
    bio: currentUser.bio || ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
   await updateProfile({
      name: form.name,
      avatarUrl: form.avatarUrl,
      bio: form.bio
    });
    navigate("/profile");
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Profile"
        title="Edit profile"
        description="Update public profile details and body summary visibility."
        actions={<Link className="button secondary" to="/profile">Cancel</Link>}
      />
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </label>
        <label>
          Avatar URL
          <input value={form.avatarUrl} onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))} />
        </label>
        <label>
          Bio
          <textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
        </label>
        <button className="button primary" type="submit">Save profile</button>
      </form>
    </div>
  );
}
