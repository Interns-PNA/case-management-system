import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Cases", path: "/cases" },
    { name: "Locations", path: "/locations" },
    { name: "Courts", path: "/courts" },
    { name: "Judges", path: "/judges" },          // ✅ Added properly
    { name: "Benches", path: "/benches" },
    { name: "Departments", path: "/departments" },
    { name: "Designations", path: "/designations" },
    { name: "Statuses", path: "/statuses" },
    { name: "Subject Matter", path: "/subject-matter" }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Close Button (for mobile view) */}
      <button className="close-btn" onClick={closeSidebar}>×</button>

      <h2>Case System</h2>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path} onClick={closeSidebar}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
