import React, { useState, useEffect } from "react";

const EditStatusModal = ({ status, onClose, onUpdate }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (status) {
      setName(status.name);
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdate({ ...status, name });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Status</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStatusModal;
