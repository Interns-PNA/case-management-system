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
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Status</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Status Name"
            required
          />
          <div className="modal-actions">
            <button type="submit" className="btn-submit">
              Update
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStatusModal;
