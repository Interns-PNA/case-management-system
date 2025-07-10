// components/EditDepartmentModal.jsx
import React, { useState, useEffect } from "react";

const EditDepartmentModal = ({ department, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        details: department.details || "",
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...department, ...formData });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Department</h3>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
