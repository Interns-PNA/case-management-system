import React, { useState, useEffect } from "react";
import axios from "axios";
import AddLocationModal from "./AddLocationModal";
import EditLocationModal from "./EditLocationModal";

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

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

  const handleAddLocation = async (newLocation) => {
    try {
      await axios.post("http://localhost:5000/api/locations", newLocation);
      fetchLocations();
      setShowModal(false);
    } catch (err) {
      console.error("Error adding location:", err);
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setEditModalOpen(true);
  };

  const handleUpdateLocation = async (updatedLocation) => {
    try {
      await axios.put(
        `http://localhost:5000/api/locations/${updatedLocation._id}`,
        updatedLocation
      );
      fetchLocations();
      setEditModalOpen(false);
    } catch (err) {
      console.error("Error updating location:", err);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axios.delete(`http://localhost:5000/api/locations/${id}`);
        fetchLocations();
      } catch (err) {
        console.error("Error deleting location:", err);
      }
    }
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2>Locations</h2>
        <button onClick={() => setShowModal(true)} className="btn-add">
          Add Location
        </button>
      </div>

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Location Name</span>
          <span>Actions</span>
        </div>
        {locations.length === 0 ? (
          <div
            className="courts-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span colSpan={3}>No locations found.</span>
          </div>
        ) : (
          locations.map((loc, index) => (
            <div className="courts-table-row" key={loc._id}>
              <span>{index + 1}</span>
              <span>{loc.name}</span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => handleEditLocation(loc)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteLocation(loc._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AddLocationModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddLocation}
        />
      )}

      {editModalOpen && (
        <EditLocationModal
          initialData={editingLocation}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdateLocation}
        />
      )}
    </div>
  );
};

export default LocationsList;
