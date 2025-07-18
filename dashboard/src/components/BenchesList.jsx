import React, { useState, useEffect } from "react";
import axios from "axios";
import AddBenchesModal from "./AddBenchesModal";
import EditBenchesModal from "./EditBenchesModal";
import SearchBar from "./SearchBar";

const BenchesList = () => {
  const [benches, setBenches] = useState([]);
  const [filteredBenches, setFilteredBenches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBench, setEditBench] = useState(null);

  useEffect(() => {
    fetchBenches();
  }, []);

  const fetchBenches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/benches");
      setBenches(res.data);
      setFilteredBenches(res.data);
    } catch (err) {
      console.error("Error fetching benches:", err);
    }
  };

  const handleAddBench = async (newBench) => {
    try {
      await axios.post("http://localhost:5000/api/benches", newBench);
      fetchBenches();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding bench:", err);
    }
  };

  const handleUpdateBench = async (updatedBench) => {
    try {
      await axios.put(`http://localhost:5000/api/benches/${updatedBench._id}`, updatedBench);
      fetchBenches();
      setEditBench(null);
    } catch (err) {
      console.error("Error updating bench:", err);
    }
  };

  const handleDeleteBench = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/benches/${id}`);
      fetchBenches();
    } catch (err) {
      console.error("Error deleting bench:", err);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = benches.filter((bench) =>
      bench.name.toLowerCase().includes(term.toLowerCase()) ||
      (Array.isArray(bench.courts) &&
        bench.courts.some((court) =>
          typeof court === "object"
            ? court.name.toLowerCase().includes(term.toLowerCase())
            : court.toLowerCase().includes(term.toLowerCase())
        ))
    );
    setFilteredBenches(filtered);
  };

  return (
    <div className="benches-list">
      <div className="courts-header">
        <h2>Benches</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            placeholder="Search Benches..."
          />
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            Add Bench
          </button>
        </div>
      </div>

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Bench Name</span>
          <span>Courts</span>
          <span>Actions</span>
        </div>

        {filteredBenches.length === 0 ? (
          <div className="courts-table-row" style={{ textAlign: "center", color: "#888" }}>
            <span colSpan={4}>No benches found.</span>
          </div>
        ) : (
          filteredBenches.map((bench, index) => (
            <div className="courts-table-row" key={bench._id}>
              <span>{index + 1}</span>
              <span>{bench.name}</span>
              <span>
                <ul style={{ paddingLeft: "18px", margin: 0 }}>
                  {Array.isArray(bench.courts) && bench.courts.length > 0 ? (
                    bench.courts.map((court) =>
                      typeof court === "object" ? (
                        <li key={court._id}>{court.name}</li>
                      ) : (
                        <li key={court}>{court}</li>
                      )
                    )
                  ) : (
                    <li>–</li>
                  )}
                </ul>
              </span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => setEditBench(bench)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteBench(bench._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddBenchesModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBench}
        />
      )}

      {editBench && (
        <EditBenchesModal
          bench={editBench}
          onClose={() => setEditBench(null)}
          onUpdate={handleUpdateBench}
        />
      )}
    </div>
  );
};

export default BenchesList;
