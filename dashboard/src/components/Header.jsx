import React from 'react';

const Header = ({ toggleSidebar, onAddCaseClick }) => {
  return (
    <div className="header">
      <button className="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1>Dashboard</h1>
      <div>
        <button onClick={onAddCaseClick} className="submit-btn">Add Case</button>
      </div>
    </div>
  );
};

export default Header;
