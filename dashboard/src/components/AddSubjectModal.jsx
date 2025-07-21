import React, { useState } from "react";

const AddSubjectModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return alert("Name is required");
    onSubmit({ name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          Add Subject Matter
        </h3>
        <input
          type="text"
          placeholder="Subject Matter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">Submit</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>

        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
