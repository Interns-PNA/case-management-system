import React, { useState, useEffect } from "react";
import axios from "axios";
import AddStatusModal from "./AddStatusModal";
import EditStatusModal from "./EditStatusModal";
import SearchBar from "./SearchBar"; // ✅ Ensure correct path
import { useAuth } from "../contexts/AuthContext";
import { Edit, Trash2 } from "lucide-react";

const StatusList = () => {
  const { canWrite } = useAuth();
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
        updatedStatus,
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
    status.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2 className="section-title">Status List</h2>
        <SearchBar
          placeholder="Search status..."
          onSearch={(value) => setSearchTerm(value)}
        />
        <div>
          {canWrite() && (
            <button className="btn-add" onClick={() => setShowAddModal(true)}>
              Add Status
            </button>
          )}
        </div>
      </div>

      {/* ✅ Use shared SearchBar component */}

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
              Status Name
            </span>
          </span>
          <span style={{ flexBasis: 220, flexShrink: 0, textAlign: "left" }}>
            Actions
          </span>
        </div>
        {filteredStatuses.length === 0 ? (
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
                No status found.
              </span>
            </span>
            <span style={{ flexBasis: 220 }} />
          </div>
        ) : (
          filteredStatuses.map((status, index) => (
            <div
              className="courts-table-row"
              key={status._id}
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
                  {status.name}
                </span>
              </span>
              <span style={{ flexBasis: 220, display: "flex", gap: "8px" }}>
                {canWrite() && (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => setEditStatus(status)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteStatus(status._id)}
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
