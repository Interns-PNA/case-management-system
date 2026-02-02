import React, { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "../lib/notify";

const EditBenchesModal = ({ bench, onClose, onUpdate }) => {
  const [name, setName] = useState(bench.name || "");
  const [courts, setCourts] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState(
    bench.courts?.map((court) =>
      typeof court === "object" ? court._id : court
    ) || []
  );

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
    if (!name || selectedCourts.length === 0) {
      notify.error("Bench name and at least one court are required.");
      return;
    }

    const updatedBench = {
      ...bench,
      name,
      courts: selectedCourts,
    };

    onUpdate(updatedBench);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Bench</h3>

        <input
          type="text"
          placeholder="Bench Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginTop: "15px" }}>
          <label>
            <strong>Select Courts:</strong>
          </label>
          <div className="checkbox-scroll-area">
            {courts.map((court) => (
              <label
                key={court._id}
                className="checkbox-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "2px 0",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 24,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCourts.includes(court._id)}
                    onChange={() => handleCheckboxChange(court._id)}
                  />
                </span>
                <span style={{ flex: 1 }}>{court.name}</span>
              </label>
            ))}
          </div>
        </div>

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

export default EditBenchesModal;
