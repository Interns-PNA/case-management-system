import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Cases", path: "/cases" },
    { name: "Locations", path: "/locations" },
    { name: "Courts", path: "/courts" },
    { name: "Judges", path: "/judges" }, // ✅ Added properly
    { name: "Benches", path: "/benches" },
    { name: "Departments", path: "/departments" },
    { name: "Designations", path: "/designations" },
    { name: "Statuses", path: "/statuses" },
    { name: "Subject Matter", path: "/subject-matter" },
  ];

  const handleLogout = () => {
    // Use AuthContext logout
    logout();

    // Close sidebar if open
    closeSidebar();

    // Navigate to login page
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close Button (for mobile view) */}
      <button className="close-btn" onClick={closeSidebar}>
        ×
      </button>

      <h2>Case System</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path} onClick={closeSidebar}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Management Button - Admin Only */}
      {isAdmin() && (
        <div className="sidebar-user-management">
          <button
            onClick={() => navigate("/user-management")}
            className="user-management-btn"
          >
            <span>User Management</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Logout Button at the bottom */}
      <div className="sidebar-logout">
        <button onClick={handleLogout} className="logout-btn">
          <span>Logout</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
