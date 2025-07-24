import React, { useState, useEffect } from "react";
import axios from "axios";
import AddStatusModal from "./AddStatusModal";
import EditStatusModal from "./EditStatusModal";
import SearchBar from "../components/SearchBar"; // ✅ Ensure correct path

const StatusList = () => {
  const [statuses, setStatuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStatus, setEditStatus] = useState(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/statuses");
      setStatuses(res.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const handleAddStatus = async (newStatus) => {
    try {
      await axios.post("http://localhost:5000/api/statuses", newStatus);
      fetchStatuses();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding status:", err);
    }
  };

  const handleUpdateStatus = async (updatedStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/statuses/${updatedStatus._id}`,
        updatedStatus
      );
      fetchStatuses();
      setEditStatus(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteStatus = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/statuses/${id}`);
      fetchStatuses();
    } catch (err) {
      console.error("Error deleting status:", err);
    }
  };

  // ✅ Filtering logic works on searchTerm
  const filteredStatuses = statuses.filter((status) =>
    status.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2>Status List</h2>
        <SearchBar
          placeholder="Search status..."
          onSearch={(value) => setSearchTerm(value)}
        />
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          Add Status
        </button>
      </div>

      {/* ✅ Use shared SearchBar component */}

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Status Name</span>
          <span>Actions</span>
        </div>
        {filteredStatuses.length === 0 ? (
          <div className="courts-table-row" style={{ textAlign: "center" }}>
            No status found.
          </div>
        ) : (
          filteredStatuses.map((status, index) => (
            <div className="courts-table-row" key={status._id}>
              <span>{index + 1}</span>
              <span>{status.name}</span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => setEditStatus(status)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteStatus(status._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddStatusModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddStatus}
        />
      )}
      {editStatus && (
        <EditStatusModal
          status={editStatus}
          onClose={() => setEditStatus(null)}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default StatusList;
