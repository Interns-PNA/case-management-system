import React, { useState } from "react";

const EditLocationModal = ({ onClose, onSubmit, initialData }) => {
  const [name, setName] = useState(initialData.name);

  const handleSubmit = () => {
    if (name.trim()) onSubmit({ ...initialData, name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Location</h3>
        <input
          type="text"
          placeholder="Location Name"
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

export default EditLocationModal;
