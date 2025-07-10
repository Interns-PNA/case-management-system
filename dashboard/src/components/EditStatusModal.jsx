import "../App.css";
import React, { useState } from "react";

const EditStatusModal = ({ status, onClose, onUpdate }) => {
  const [name, setName] = useState(status.name || "");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Status name is required.");
      return;
    }
    onUpdate({ ...status, name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Status</h3>
        <input
          type="text"
          placeholder="Status Name"
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

export default EditStatusModal;
