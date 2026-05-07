import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
const AuthContext = createContext(null);

function withoutPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

 

  async function login(email, password) {
    const response = await axios.post("http://localhost:3000/api/login", { email, password });
    const id=response.data;
    
    if (!id) {
      return { ok: false, message: "Invalid email or password." };
    }
    setCurrentUserId(id);
    return { ok: true };
  }



  function logout() {
    setCurrentUserId(null);
  }

  function updateProfile(profile) {
    setUsers((current) => current.map((user) => (user.id === currentUserId ? { ...user, ...profile } : user)));
  }

  function getUserById(userId) {
    return withoutPassword(users.find((user) => user.id === userId));
  }

  const value = useMemo(
    () => ({
      users: users.map(withoutPassword),
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout,
      updateProfile,
      getUserById
    }),
    [users, currentUserId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
