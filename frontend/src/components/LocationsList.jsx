import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddLocationModal from "./AddLocationModal";
import EditLocationModal from "./EditLocationModal";
import { Edit, Trash2 } from "lucide-react";
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
        <h2 className="section-title">Locations</h2>

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
        <div
          className="courts-table-header"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            gap: "8px",
          }}
        >
          <span style={{ width: 70, textAlign: "left" }}>S.No</span>
          <span style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <span
              style={{
                display: "inline-block",
                textAlign: "left",
                minWidth: "60%",
                maxWidth: "90%",
              }}
            >
              Location Name
            </span>
          </span>
          <span style={{ flexBasis: 220, flexShrink: 0, textAlign: "left" }}>
            Actions
          </span>
        </div>

        {filteredLocations.length === 0 ? (
          <div
            className="courts-table-row"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              color: "#777",
            }}
          >
            <span style={{ width: 70 }}>–</span>
            <span
              style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <span
                style={{
                  display: "inline-block",
                  textAlign: "left",
                  minWidth: "60%",
                  maxWidth: "90%",
                }}
              >
                No locations found.
              </span>
            </span>
            <span style={{ flexBasis: 220 }} />
          </div>
        ) : (
          filteredLocations.map((loc, index) => (
            <div
              className="courts-table-row"
              key={loc._id || index}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                gap: "8px",
              }}
            >
              <span style={{ width: 70 }}>{index + 1}</span>
              <span
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    textAlign: "left",
                    minWidth: "60%",
                    maxWidth: "90%",
                  }}
                >
                  {loc.name}
                </span>
              </span>
              <span style={{ flexBasis: 220, display: "flex", gap: "8px" }}>
                {canWrite() && (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditLocation(loc)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteLocation(loc._id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
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
