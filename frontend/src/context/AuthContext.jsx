import { createContext, useContext, useMemo, useState } from "react";
import { users as initialUsers } from "../data/mockData.js";

const AuthContext = createContext(null);

function withoutPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = withoutPassword(users.find((user) => user.id === currentUserId));

  function login(email, password) {
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }
    setCurrentUserId(user.id);
    return { ok: true };
  }

  function register({ name, email, password }) {
    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      avatarUrl: "",
      bio: "",
      createdAt: new Date().toISOString().slice(0, 10),
      sex: "",
      birthDate: "",
      activityLevel: "moderate",
      privacy: {
        showLatestBodyRecord: false
      }
    };
    setUsers((current) => [...current, user]);
    setCurrentUserId(user.id);
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
