import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FitnessDataProvider } from "./context/FitnessDataContext.jsx";
import { ProgramProvider } from "./context/ProgramContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditProgramPage from "./pages/EditProgramPage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import BodyRecordsPage from "./pages/BodyRecordsPage.jsx";
import DietPlanPage from "./pages/DietPlanPage.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SocialPage from "./pages/SocialPage.jsx";
import PublicProfilePage from "./pages/PublicProfilePage.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ProgramProvider>
        <FitnessDataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/users/:userId" element={<PublicProfilePage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/program" element={<ProgramPage />} />
                  <Route path="/program/edit" element={<EditProgramPage />} />
                  <Route path="/workouts" element={<Navigate to="/program" replace />} />
                  <Route path="/workouts/new" element={<Navigate to="/program/edit" replace />} />
                  <Route path="/body" element={<BodyRecordsPage />} />
                  <Route path="/diet" element={<DietPlanPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/social" element={<SocialPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<EditProfilePage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </FitnessDataProvider>
      </ProgramProvider>
    </AuthProvider>
  </React.StrictMode>
);
