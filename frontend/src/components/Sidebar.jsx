import React from "react";
import naLogo from "../assets/na.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Gavel,
  Users,
  Layers,
  Building2,
  BadgePercent,
  Tag,
  BookText,
} from "lucide-react";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Cases",
      path: "/cases",
      icon: <FolderKanban size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Locations",
      path: "/locations",
      icon: <MapPin size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Courts",
      path: "/courts",
      icon: <Gavel size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Judges",
      path: "/judges",
      icon: <Users size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Benches",
      path: "/benches",
      icon: <Layers size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Departments",
      path: "/departments",
      icon: <Building2 size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Designations",
      path: "/designations",
      icon: <BadgePercent size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Statuses",
      path: "/statuses",
      icon: <Tag size={18} style={{ marginRight: 8 }} />,
    },
    {
      name: "Subject Matter",
      path: "/subject-matter",
      icon: <BookText size={18} style={{ marginRight: 8 }} />,
    },
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "18px 0 25px 0",
        }}
      >
        <img
          src={naLogo}
          alt="NA Logo"
          style={{ width: 48, height: 48, objectFit: "contain" }}
        />
      </div>
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={index}
              className={isActive ? "active" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 8,
                margin: "2px 0",
                background: isActive ? "#e8f0fe" : "transparent",
                transition: "background 0.2s",
              }}
            >
              <Link
                to={item.path}
                onClick={closeSidebar}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  color: isActive ? "#1967d2" : "#222",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  padding: "1px 10px",
                  borderRadius: 8,
                  background: "none",
                  transition: "color 0.2s",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
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
