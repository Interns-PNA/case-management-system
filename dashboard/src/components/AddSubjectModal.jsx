import React, { useState } from 'react';

const AddSubjectModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return alert("Name is required");
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Subject Matter</h3>
        <input
          type="text"
          placeholder="Subject Matter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-submit" onClick={handleSubmit}>Submit</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>        
    </div>
  );
};

export default AddSubjectModal;
