import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CaseForm from './components/CaseForm';
import CourtsList from './components/CourtsList';
import LocationsList from './components/LocationsList'; // ✅ Import here
import JudgesList from './components/JudgesList'; // ✅ adjust path if needed
import SubjectMatterList from './components/SubjectMattersList'; // ✅ import


import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Header
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onAddCaseClick={() => setShowForm(true)}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={showForm ? <CaseForm onCancel={handleCancel} /> : <Dashboard />} />
            <Route path="/courts" element={<CourtsList />} />
            <Route path="/locations" element={<LocationsList />} /> {/* ✅ Added */}
            <Route path="/judges" element={<JudgesList />} /> {/* ✅ ADD THIS */}
            <Route path="/subject-matter" element={<SubjectMatterList />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
