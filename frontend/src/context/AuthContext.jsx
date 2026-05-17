import { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const users = currentUser ? [currentUser] : [];

  async function login(email, password) {
    try {
      const response = await axios.post("http://localhost:3000/api/login", { email, password });
      setCurrentUser(response.data.user);
      localStorage.setItem("token",response.data.token);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Invalid email or password."
      };
    }
  }
  async function validateToken(token) {
    try {
      const response = await axios.get("http://localhost:3000/api/validate-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    }
  }
  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("token");
  }

  async function updateProfile({name,avatarUrl,bio}) {
    const response = await axios.put('http://localhost:3000/api/user', {
      name,avatarUrl,bio
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }); 
    setCurrentUser(response.data);
  }

  function getUserById(userId) {
    return users.find((user) => user.id === userId);
  }

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      updateProfile,
      getUserById,
      validateToken
    }),
    [currentUser]
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
