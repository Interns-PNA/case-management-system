import "../App.css";
import React, { useState } from "react";

const EditDesignationModal = ({ designation, onClose, onUpdate }) => {
  const [name, setName] = useState(designation.name || "");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Designation name is required.");
      return;
    }
    onUpdate({ ...designation, name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Designation</h3>
        <input
          type="text"
          placeholder="Designation Name"
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

export default EditDesignationModal;
