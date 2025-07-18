import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const EditDesignationModal = ({ designation, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: designation.name || "",
    details: designation.details || "",
    department: designation.department?._id || "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Designation name is required.");
      return;
    }

    onUpdate({
      ...designation,
      name: formData.name,
      details: formData.details,
      department: formData.department,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Designation</h3>
        <input
          type="text"
          name="name"
          placeholder="Designation Name"
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          name="details"
          placeholder="Designation Details"
          value={formData.details}
          onChange={handleChange}
          rows="3"
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

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

export default EditDesignationModal;
