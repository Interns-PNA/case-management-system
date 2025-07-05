import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCourtModal from './AddCourtModal';
import EditCourtModal from './EditCourtModal';

const CourtsList = () => {
  const [courts, setCourts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCourt, setEditCourt] = useState(null);

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

  const handleAddCourt = async (newCourt) => {
    try {
      await axios.post("http://localhost:5000/api/courts", newCourt);
      fetchCourts();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding court:", err);
    }
  };

  const handleUpdateCourt = async (updatedCourt) => {
    try {
      await axios.put(`http://localhost:5000/api/courts/${updatedCourt._id}`, {
        name: updatedCourt.name,
        locations: updatedCourt.locations,
      });
      fetchCourts();
      setEditCourt(null);
    } catch (err) {
      console.error("Error updating court:", err);
    }
  };

  const handleDeleteCourt = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courts/${id}`);
      fetchCourts();
    } catch (err) {
      console.error("Error deleting court:", err);
    }
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2>Courts</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          Add Court
        </button>
      </div>

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Court Name</span>
          <span>Locations</span>
          <span>Actions</span>
        </div>

        {courts.map((court, index) => (
          <div className="courts-table-row" key={court._id}>
            <span>{index + 1}</span>
            <span>{court.name}</span>
            <span>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {Array.isArray(court.locations) && court.locations.length > 0 ? (
                  court.locations.map((loc) =>
                    typeof loc === 'object' ? (
                      <li key={loc._id}>{loc.name}</li>
                    ) : (
                      <li key={loc}>{loc}</li> // fallback if loc is just ID
                    )
                  )
                ) : (
                  <li>–</li>
                )}
              </ul>
            </span>
            <span>
              <button className="btn-edit" onClick={() => setEditCourt(court)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDeleteCourt(court._id)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddCourtModal onClose={() => setShowAddModal(false)} onSubmit={handleAddCourt} />
      )}

      {editCourt && (
        <EditCourtModal
          court={editCourt}
          onClose={() => setEditCourt(null)}
          onUpdate={handleUpdateCourt}
        />
      )}
    </div>
  );
};

export default CourtsList;
