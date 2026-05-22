import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activation from "./pages/Activation";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import AdminLayout from "./components/AdminLayout";
import StudentLayout from "./components/StudentLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/activation/:uid/:token" element={<Activation />} />
      <Route path="/activate" element={<Activation />} />
      <Route path="/activate/:uid/:token" element={<Activation />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
      <Route path="/password-reset/confirm/:uid/:token" element={<PasswordResetConfirm />} />
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      } />
      <Route path="/student/*" element={
        <ProtectedRoute requiredRole="student">
          <StudentLayout />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
