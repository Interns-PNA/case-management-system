import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import LoginForm from "./components/login-form";
import UserManagementModule from "./components/UserManagementModule";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <Dashboard />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <CasesList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courts"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <CourtsList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/benches"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <BenchesList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/locations"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <LocationsList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/judges"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <JudgesList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject-matter"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <SubjectMatterList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/statuses"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <StatusList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/designations"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <DesignationsList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <DepartmentsList />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <CaseForm />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div className="app-container">
                  <Sidebar
                    isOpen={sidebarOpen}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                  <div className="main-content">
                    <Header
                      toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    />
                    <UserManagementModule />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
