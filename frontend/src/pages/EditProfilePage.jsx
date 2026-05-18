import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
export default function EditProfilePage() {
  const navigate = useNavigate();
  const {currentUser, updateProfile } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [form, setForm] = useState({
    name: currentUser.name,
    avatarUrl: currentUser.avatar,
    bio: currentUser.bio || ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
   const newAvatarUrl = await updateAvatar(avatarFile);
   await updateProfile({
      name: form.name,
      avatarUrl: newAvatarUrl||form.avatarUrl,
      bio: form.bio
    });
    navigate("/profile");
  }
  async function updateAvatar(avatarFile) {
    if (!avatarFile) return;
    
    try {
      const response = await axios.post("http://localhost:3000/api/uploads/avatar-url",  
        {
          fileName: avatarFile.name,
          fileType: avatarFile.type
        },
        {
          headers: {
          
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (response.status === 200) {
        
        setAvatarFile(null);
        return response.data.avatarUrl;
      }
  }   catch (error) { console.error("Failed to upload avatar:", error);
    }
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
          Avatar
          <input type="file" accept="image/*" onChange={(event)=>{
            const file = event.target.files[0];
            setAvatarFile(file);
            
          }} />

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
