import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddJudgeModal from "./AddJudgeModal";
import EditJudgeModal from "./EditJudgeModal";
import SearchBar from "./SearchBar"; // ✅ Importing reusable SearchBar

const JudgesList = () => {
  const { canWrite } = useAuth();
  const [judges, setJudges] = useState([]);
  const [filteredJudges, setFilteredJudges] = useState([]); // ✅ filtered state
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search term
  const [showAddModal, setShowAddModal] = useState(false);
  const [editJudge, setEditJudge] = useState(null);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/judges");
      setJudges(res.data);
      setFilteredJudges(res.data); // ✅ sync filtered initially
    } catch (err) {
      console.error("Error fetching judges:", err);
    }
  };

  // ✅ Filter handler
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = judges.filter(
      (j) =>
        j.name.toLowerCase().includes(term.toLowerCase()) ||
        j.court?.name?.toLowerCase().includes(term.toLowerCase()) ||
        j.location?.name?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredJudges(filtered);
  };

  const handleAddJudge = async (newJudge) => {
    try {
      await axios.post("http://localhost:5000/api/judges", newJudge);
      fetchJudges();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding judge:", err);
    }
  };

  const handleUpdateJudge = async (updatedJudge) => {
    try {
      await axios.put(
        `http://localhost:5000/api/judges/${updatedJudge._id}`,
        updatedJudge
      );
      fetchJudges();
      setEditJudge(null);
    } catch (err) {
      console.error("Error updating judge:", err);
    }
  };

  const handleDeleteJudge = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/judges/${id}`);
      fetchJudges();
    } catch (err) {
      console.error("Error deleting judge:", err);
    }
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2 className="section-title">Judges</h2>

        {/* ✅ Reusable Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search Judges..."
        />

        <div>
          {canWrite() && (
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              Add Judge
            </button>
          )}
        </div>
      </div>

      <div className="judges-table">
        <div className="judges-table-header">
          <span>S.No</span>
          <span>Name</span>
          <span>Court</span>
          <span>Location</span>
          <span>Actions</span>
        </div>

        {/* ✅ Use filteredJudges instead of judges */}
        {filteredJudges.length === 0 ? (
          <div
            className="judges-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span colSpan={5}>No judges found.</span>
          </div>
        ) : (
          filteredJudges.map((judge, index) => (
            <div className="judges-table-row" key={judge._id}>
              <span>{index + 1}</span>
              <span>{judge.name}</span>
              <span>{judge.court?.name || "-"}</span>
              <span>{judge.location?.name || "-"}</span>
              <span>
                {canWrite() && (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => setEditJudge(judge)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteJudge(judge._id)}
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
        <AddJudgeModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddJudge}
        />
      )}

      {editJudge && (
        <EditJudgeModal
          judge={editJudge}
          onClose={() => setEditJudge(null)}
          onUpdate={handleUpdateJudge}
        />
      )}
    </div>
  );
};

export default JudgesList;
