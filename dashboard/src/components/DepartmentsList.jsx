import React, { useState, useEffect } from "react";
import axios from "axios";
import AddDepartmentModal from "./AddDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleAddDepartment = async (newDepartment) => {
    try {
      await axios.post("http://localhost:5000/api/departments", newDepartment);
      fetchDepartments();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding department:", err);
    }
  };

  const handleUpdateDepartment = async (updatedDepartment) => {
    try {
      await axios.put(
        `http://localhost:5000/api/departments/${updatedDepartment._id}`,
        updatedDepartment
      );
      fetchDepartments();
      setEditDepartment(null);
    } catch (err) {
      console.error("Error updating department:", err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  return (
    <div className="benches-list">
      <div className="courts-header">
        <h2>Departments</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          Add Department
        </button>
      </div>
      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Department Name</span>
          <span>Actions</span>
        </div>
        {departments.length === 0 ? (
          <div
            className="courts-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span colSpan={3}>No departments found.</span>
          </div>
        ) : (
          departments.map((department, index) => (
            <div className="courts-table-row" key={department._id}>
              <span>{index + 1}</span>
              <span>{department.name}</span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => setEditDepartment(department)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteDepartment(department._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
      {showAddModal && (
        <AddDepartmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDepartment}
        />
      )}
      {editDepartment && (
        <EditDepartmentModal
          department={editDepartment}
          onClose={() => setEditDepartment(null)}
          onUpdate={handleUpdateDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentsList;
