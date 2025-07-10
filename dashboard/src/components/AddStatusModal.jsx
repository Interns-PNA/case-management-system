import "../App.css";
import React, { useState } from "react";

const AddStatusModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Status name is required.");
      return;
    }
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Status</h3>
        <input
          type="text"
          placeholder="Status Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">
            Submit
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStatusModal;
