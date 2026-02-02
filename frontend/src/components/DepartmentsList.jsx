// components/DepartmentsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";
import { Edit, Trash2 } from "lucide-react";
import AddDepartmentModal from "./AddDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";

const DepartmentsList = () => {
  const { canWrite } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDept, setEditDept] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
      setFilteredDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(term.toLowerCase()) ||
        (dept.details &&
          dept.details.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredDepartments(filtered);
  };

  const handleAddDepartment = async (newDept) => {
    try {
      await axios.post("http://localhost:5000/api/departments", newDept);
      fetchDepartments();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  const handleUpdateDepartment = async (updatedDept) => {
    try {
      await axios.put(
        `http://localhost:5000/api/departments/${updatedDept._id}`,
        updatedDept
      );
      fetchDepartments();
      setEditDept(null);
    } catch (err) {
      console.error("Error updating department:", err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error("Error deleting department:", err);
      }
    }
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2 className="section-title">Departments</h2>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search Departments..."
        />
        <div>
          {canWrite() && (
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              Add Department
            </button>
          )}
        </div>
      </div>

      <div className="departments-table">
        <div className="departments-table-header">
          <span>S.No</span>
          <span>Name</span>
          <span>Details</span>
          <span>Cases</span>
          <span>Actions</span>
        </div>

        {filteredDepartments.map((dept, index) => (
          <div className="departments-table-row" key={dept._id}>
            <span>{index + 1}</span>
            <span>{dept.name}</span>
            <span>{dept.details || "–"}</span>
            <span>{dept.cases || 0}</span>
            <span className="actions-container">
              {canWrite() && (
                <>
                  <button
                    className="btn-edit"
                    onClick={() => setEditDept(dept)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteDepartment(dept._id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddDepartmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDepartment}
        />
      )}

      {editDept && (
        <EditDepartmentModal
          department={editDept}
          onClose={() => setEditDept(null)}
          onUpdate={handleUpdateDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
