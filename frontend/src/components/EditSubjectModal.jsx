import React, { useState } from "react";
import { notify } from "../lib/notify";

const EditSubjectModal = ({ subject, onClose, onUpdate }) => {
  const [name, setName] = useState(subject.name || "");

  const handleSubmit = () => {
    if (!name.trim()) return notify.error("Name is required");
    onUpdate({ ...subject, name });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Subject Matter</h3>
        <input
          type="text"
          placeholder="Subject Matter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-actions">
          <button className="btn-submit" onClick={handleSubmit}>
            Update
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubjectModal;
