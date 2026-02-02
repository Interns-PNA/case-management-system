import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireWrite = false,
}) => {
  const { isAuthenticated, isAdmin, canWrite, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#dc3545",
        }}
      >
        <h2>Access Denied</h2>
        <p>You don&apos;t have permission to access this page.</p>
        <p>Admin access required.</p>
      </div>
    );
  }

  if (requireWrite && !canWrite()) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: "#dc3545",
        }}
      >
        <h2>Access Denied</h2>
        <p>You don&apos;t have permission to access this page.</p>
        <p>Write access required.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
