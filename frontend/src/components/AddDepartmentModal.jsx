// components/AddDepartmentModal.jsx
import React, { useState } from "react";
// Reuse your modal styling

const AddDepartmentModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Department</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Department Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="details"
            placeholder="Department Details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
          />
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
