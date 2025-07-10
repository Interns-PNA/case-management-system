import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddBenchesModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [courts, setCourts] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState([]);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courts");
      setCourts(res.data);
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  const handleCheckboxChange = (courtId) => {
    setSelectedCourts((prev) =>
      prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId]
    );
  };

  const handleSubmit = () => {
    if (!name.trim() || selectedCourts.length === 0) {
      alert("Bench name and at least one court are required.");
      return;
    }
    onSubmit({ name, courts: selectedCourts });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Bench</h3>
        <input
          type="text"
          placeholder="Bench Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ marginBottom: "10px" }}>
          <strong>Select Courts:</strong>
          <div
            style={{ maxHeight: "120px", overflowY: "auto", marginTop: "5px" }}
          >
            {courts.map((court) => (
              <label key={court._id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  value={court._id}
                  checked={selectedCourts.includes(court._id)}
                  onChange={() => handleCheckboxChange(court._id)}
                />
                {` ${court.name}`}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">
            Submit
          </button>
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBenchesModal;
