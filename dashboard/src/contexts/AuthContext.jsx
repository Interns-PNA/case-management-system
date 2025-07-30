import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem("user");
    const isAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && isAuth === "true") {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userSession");
    sessionStorage.clear();
  };

  // Permission checking functions
  const hasPermission = (requiredPermission) => {
    if (!user) return false;

    switch (requiredPermission) {
      case "read":
        return (
          user.permission === "read-only" || user.permission === "read-write"
        );
      case "write":
        return user.permission === "read-write";
      case "admin":
        return user.permission === "read-write"; // Assuming read-write users are admins
      default:
        return false;
    }
  };

  const isAdmin = () => hasPermission("admin");
  const canWrite = () => hasPermission("write");
  const canRead = () => hasPermission("read");

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission,
    isAdmin,
    canWrite,
    canRead,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
