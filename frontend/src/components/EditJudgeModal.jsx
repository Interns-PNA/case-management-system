import React, { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "../lib/notify";

const EditJudgeModal = ({ judge, onClose, onUpdate }) => {
  const [name, setName] = useState(judge.name || "");
  const [courts, setCourts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(judge.court?._id || "");
  const [selectedLocation, setSelectedLocation] = useState(
    judge.location?._id || ""
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courts")
      .then((res) => setCourts(res.data));
    axios
      .get("http://localhost:5000/api/locations")
      .then((res) => setLocations(res.data));
  }, []);

  const handleSubmit = () => {
    if (!name || !selectedCourt || !selectedLocation) {
      notify.error("All fields are required.");
      return;
    }

    onUpdate({
      _id: judge._id,
      name,
      court: selectedCourt,
      location: selectedLocation,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="font-bold">Edit Judge</h3>
        <input
          type="text"
          placeholder="Judge Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={selectedCourt}
          onChange={(e) => setSelectedCourt(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <option value="">Select Court</option>
          {courts.map((court) => (
            <option key={court._id} value={court._id}>
              {court.name}
            </option>
          ))}
        </select>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            border: "1px solid #d1d5db",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}
        </select>

        <div className="modal-actions" style={{ marginTop: "12px" }}>
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

export default EditJudgeModal;
