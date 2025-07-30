import React, { useState, useEffect } from "react";
import axios from "axios";
import AddDesignationModal from "./AddDesignationModal";
import EditDesignationModal from "./EditDesignationModal";
import SearchBar from "./SearchBar"; // ✅ Reusable search bar
import { useAuth } from "../contexts/AuthContext";

const DesignationsList = () => {
  const { canWrite } = useAuth();
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDesignation, setEditDesignation] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/designations");
      setDesignations(res.data);
      setFilteredDesignations(res.data);
    } catch (err) {
      console.error("Error fetching designations:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = designations.filter(
      (d) =>
        d.name?.toLowerCase().includes(term.toLowerCase()) ||
        d.details?.toLowerCase().includes(term.toLowerCase()) ||
        d.department?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDesignations(filtered);
  };

  const handleAddDesignation = async (newDesignation) => {
    try {
      await axios.post(
        "http://localhost:5000/api/designations",
        newDesignation
      );
      fetchDesignations();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding designation:", err);
    }
  };

  const handleUpdateDesignation = async (updatedDesignation) => {
    try {
      await axios.put(
        `http://localhost:5000/api/designations/${updatedDesignation._id}`,
        updatedDesignation
      );
      fetchDesignations();
      setEditDesignation(null);
    } catch (err) {
      console.error("Error updating designation:", err);
    }
  };

  const handleDeleteDesignation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/designations/${id}`);
      fetchDesignations();
    } catch (err) {
      console.error("Error deleting designation:", err);
    }
  };

  return (
    <div className="designations-table">
      <div
        style={{ margin: "0px", padding: "10px 0" }}
        className="courts-header"
      >
        <h2>Designations</h2>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search designations..."
        />
        <div>
          {canWrite() && (
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              Add Designation
            </button>
          )}
        </div>
      </div>

      <div className="designations-table-content">
        <div style={{ margin: "5px 0" }} className="designations-table-header">
          <span>S.No</span>
          <span>Name</span>
          <span>Details</span>
          <span>Department</span>
          <span>Actions</span>
        </div>

        {filteredDesignations.length === 0 ? (
          <div
            className="designations-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span>No designations found.</span>
          </div>
        ) : (
          filteredDesignations.map((designation, index) => (
            <div className="designations-table-row" key={designation._id}>
              <span>{index + 1}</span>
              <span>{designation.name}</span>
              <span>{designation.details || "–"}</span>
              <span>{designation.department?.name || "–"}</span>
              <span>
                {canWrite() && (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => setEditDesignation(designation)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteDesignation(designation._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </span>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddDesignationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDesignation}
        />
      )}

      {editDesignation && (
        <EditDesignationModal
          designation={editDesignation}
          onClose={() => setEditDesignation(null)}
          onUpdate={handleUpdateDesignation}
        />
      )}
    </div>
  );
};

export default DesignationsList;
