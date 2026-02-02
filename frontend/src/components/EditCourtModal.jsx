import React, { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "../lib/notify";

const EditCourtModal = ({ court, onClose, onUpdate }) => {
  const [name, setName] = useState(court.name || "");
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(
    court.locations?.map((loc) => (typeof loc === "object" ? loc._id : loc)) ||
      []
  );

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const handleCheckboxChange = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSubmit = () => {
    if (!name || selectedLocations.length === 0) {
      notify.error("Court name and at least one location are required.");
      return;
    }

    const updatedCourt = {
      ...court,
      name,
      locations: selectedLocations, // ✅ correct key
    };

    onUpdate(updatedCourt);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Court</h3>

        <input
          type="text"
          placeholder="Court Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginBottom: "10px" }}>
          <strong>Select Locations:</strong>
          <div
            style={{ maxHeight: "120px", overflowY: "auto", marginTop: "5px" }}
          >
            {locations.map((loc) => (
              <label
                key={loc._id}
                className="location-checkbox-row"
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
                    value={loc._id}
                    checked={selectedLocations.includes(loc._id)}
                    onChange={() => handleCheckboxChange(loc._id)}
                  />
                </span>
                <span style={{ flex: 1 }}>{loc.name}</span>
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

export default EditCourtModal;
