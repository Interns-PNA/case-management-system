import React, { useState, useEffect } from "react";
import axios from "axios";
import AddDesignationModal from "./AddDesignationModal";
import EditDesignationModal from "./EditDesignationModal";

const DesignationsList = () => {
  const [designations, setDesignations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDesignation, setEditDesignation] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/designations");
      setDesignations(res.data);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  const handleAddDesignation = async (newDesignation) => {
    try {
      await axios.post(
        "http://localhost:5000/api/designations",
        newDesignation
      );
      fetchDesignations();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding designation:", err);
    }
  };

  const handleUpdateDesignation = async (updatedDesignation) => {
    try {
      await axios.put(
        `http://localhost:5000/api/designations/${updatedDesignation._id}`,
        updatedDesignation
      );
      fetchDesignations();
      setEditDesignation(null);
    } catch (err) {
      console.error("Error updating designation:", err);
    }
  };

  const handleDeleteDesignation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/designations/${id}`);
      fetchDesignations();
    } catch (err) {
      console.error("Error deleting designation:", err);
    }
  };

  return (
    <div className="benches-list">
      <div className="courts-header">
        <h2>Designations</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          Add Designation
        </button>
      </div>
      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Designation Name</span>
          <span>Actions</span>
        </div>
        {designations.length === 0 ? (
          <div
            className="courts-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span colSpan={3}>No designations found.</span>
          </div>
        ) : (
          designations.map((designation, index) => (
            <div className="courts-table-row" key={designation._id}>
              <span>{index + 1}</span>
              <span>{designation.name}</span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => setEditDesignation(designation)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteDesignation(designation._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
      {showAddModal && (
        <AddDesignationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDesignation}
        />
      )}
      {editDesignation && (
        <EditDesignationModal
          designation={editDesignation}
          onClose={() => setEditDesignation(null)}
          onUpdate={handleUpdateDesignation}
        />
      )}
    </div>
  );
};

export default DesignationsList;
