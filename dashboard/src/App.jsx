import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CaseForm from './components/CaseForm';
import CourtsList from './components/CourtsList';
import LocationsList from './components/LocationsList';
import JudgesList from './components/JudgesList';
import SubjectMatterList from './components/SubjectMattersList';
import DepartmentsList from './components/DepartmentsList';

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

          {/* CaseForm is shown globally over any page */}
          {showForm && <CaseForm onCancel={handleCancel} />}

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Dashboard />} />
            <Route path="/courts" element={<CourtsList />} />
            <Route path="/locations" element={<LocationsList />} />
            <Route path="/judges" element={<JudgesList />} />
            <Route path="/subject-matter" element={<SubjectMatterList />} />
            <Route path="/departments" element={<DepartmentsList />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
