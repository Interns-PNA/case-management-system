import React, { useState } from "react";

const AddStatusModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Status</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter status name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">Submit</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default AddStatusModal;
