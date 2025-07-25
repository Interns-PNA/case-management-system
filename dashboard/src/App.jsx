import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CaseForm from "./components/CaseForm";
import CourtsList from "./components/CourtsList";
import LocationsList from "./components/LocationsList";
import JudgesList from "./components/JudgesList";
import SubjectMatterList from "./components/SubjectMattersList";
import BenchesList from "./components/BenchesList";
import StatusList from "./components/StatusList";
import DesignationsList from "./components/DesignationsList";
import DepartmentsList from "./components/DepartmentsList";
import CasesList from "./components/CasesList";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        <div className="main-content">
          <Header
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onAddCaseClick={() => setShowForm(true)}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/courts" element={<CourtsList />} />
            <Route path="/benches" element={<BenchesList />} />
            <Route path="/locations" element={<LocationsList />} />
            <Route path="/judges" element={<JudgesList />} />
            <Route path="/subject-matter" element={<SubjectMatterList />} />
            <Route path="/statuses" element={<StatusList />} />
            <Route path="/designations" element={<DesignationsList />} />
            <Route path="/departments" element={<DepartmentsList />} />
            <Route path="/form" element={<CaseForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
