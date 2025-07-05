import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddCourtModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/locations');
      setLocations(res.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
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
    if (name && selectedLocations.length > 0) {
      onSubmit({ name, locations: selectedLocations });
    } else {
      alert("Court name and at least one location are required.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Court</h3>

        <input
          type="text"
          placeholder="Court Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginBottom: '10px' }}>
          <strong>Select Locations:</strong>
          <div style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '5px' }}>
            {locations.map((loc) => (
              <label key={loc._id} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  value={loc._id}
                  checked={selectedLocations.includes(loc._id)}
                  onChange={() => handleCheckboxChange(loc._id)}
                  
                />
                {` ${loc.name}`}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-submit">Submit</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCourtModal;
