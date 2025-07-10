import "../App.css";
import React, { useState } from "react";

const EditDepartmentModal = ({ department, onClose, onUpdate }) => {
  const [name, setName] = useState(department.name || "");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Department name is required.");
      return;
    }
    onUpdate({ ...department, name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Department</h3>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">
            Update
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
