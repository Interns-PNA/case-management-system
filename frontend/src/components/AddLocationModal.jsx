import React, { useState } from 'react';

const AddLocationModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name) onSubmit({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Location</h3>
        <input type="text" placeholder="Location Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">Submit</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;