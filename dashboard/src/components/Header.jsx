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
          <button
            onClick={handleAddCaseClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#4285f4",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Roboto, Arial, sans-serif",
              letterSpacing: "0.25px",
              boxShadow:
                "0 1px 3px rgba(66, 133, 244, 0.3), 0 1px 2px rgba(66, 133, 244, 0.2)",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#3367d6";
              e.target.style.boxShadow =
                "0 2px 6px rgba(66, 133, 244, 0.4), 0 2px 4px rgba(66, 133, 244, 0.3)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#4285f4";
              e.target.style.boxShadow =
                "0 1px 3px rgba(66, 133, 244, 0.3), 0 1px 2px rgba(66, 133, 244, 0.2)";
              e.target.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 1px 2px rgba(66, 133, 244, 0.3)";
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow =
                "0 2px 6px rgba(66, 133, 244, 0.4), 0 2px 4px rgba(66, 133, 244, 0.3)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Case
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
