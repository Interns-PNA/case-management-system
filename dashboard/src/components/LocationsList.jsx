import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddLocationModal from "./AddLocationModal";
import EditLocationModal from "./EditLocationModal";
import SearchBar from "./SearchBar"; // ✅ Import SearchBar

const LocationsList = () => {
  const { canWrite } = useAuth();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]); // ✅ Filtered results
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search term

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
      setFilteredLocations(res.data); // ✅ initialize filtered list
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

  // ✅ Search handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2>Locations</h2>

        {/* ✅ SearchBar Component before Add Button */}
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search Locations..."
        />

        <div>
          {canWrite() && (
            <button onClick={() => setShowModal(true)} className="btn-add">
              Add Location
            </button>
          )}
        </div>
      </div>

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Location Name</span>
          <span>Actions</span>
        </div>

        {/* ✅ Use filteredLocations instead of locations */}
        {filteredLocations.map((loc, index) => (
          <div className="courts-table-row" key={index}>
            <span>{index + 1}</span>
            <span>{loc.name}</span>
            <span>
              {canWrite() && (
                <>
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
                </>
              )}
            </span>
          </div>
        ))}
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
