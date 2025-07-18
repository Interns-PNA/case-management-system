import React, { useState } from "react";

const AddStatusModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Status</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter status name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStatusModal;
