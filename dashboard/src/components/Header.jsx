import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { canWrite } = useAuth();

  const handleAddCaseClick = () => {
    navigate("/form");
  };

  return (
    <div className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <h1>Dashboard</h1>
      <div>
        {canWrite() && (
          <button onClick={handleAddCaseClick} className="submit-btn">
            Add Case
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
