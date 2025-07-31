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
    <div
      className="header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        height: "80px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(20,58,109,0.07)",
      }}
    >
      <button
        className="menu-btn"
        onClick={toggleSidebar}
        style={{
          fontSize: "2rem",
          color: "#143a6d",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginRight: "2rem",
        }}
      >
        ☰
      </button>
      <h1
        style={{
          fontFamily: "Roboto, Arial, sans-serif",
          fontSize: "2.5rem",
          fontWeight: 900,
          letterSpacing: "0.5px",
          background:
            "linear-gradient(90deg, #0d47a1 0%, #1976d2 30%, #42a5f5 60%, #90caf9 80%, #174ea6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          margin: 0,
          lineHeight: 1.1,
          flex: 1,
          textAlign: "center",
          textShadow: "0 2px 8px rgba(60,64,67,0.13)",
        }}
      >
        Case Tracking System
      </h1>
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
