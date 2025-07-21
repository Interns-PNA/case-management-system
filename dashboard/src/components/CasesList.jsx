import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import { Edit, Trash2 } from "lucide-react";
import CaseForm from "./CaseForm";
import { Link } from "react-router-dom";

const CasesList = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCase, setEditCase] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetchCases();
    fetchStatuses();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cases");
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/statuses");
      setStatuses(res.data);
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  const getStatusName = (id) => {
    const status = statuses.find((s) => s._id === id);
    return status ? status.name : id;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = cases.filter(
      (c) =>
        c.caseNo.toLowerCase().includes(term.toLowerCase()) ||
        (c.caseTitle &&
          c.caseTitle.toLowerCase().includes(term.toLowerCase())) ||
        (getStatusName(c.status) &&
          getStatusName(c.status).toLowerCase().includes(term.toLowerCase())) ||
        (c.ministry && c.ministry.toLowerCase().includes(term.toLowerCase())) ||
        (c.subjectMatter &&
          typeof c.subjectMatter === "string" &&
          c.subjectMatter.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredCases(filtered);
  };

  const handleUpdateCase = async (updatedCase) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cases/${updatedCase._id}`,
        updatedCase
      );
      fetchCases();
      setEditCase(null);
    } catch (err) {
      console.error("Error updating case:", err);
    }
  };

  const handleDeleteCase = async (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cases/${id}`);
        fetchCases();
      } catch (err) {
        console.error("Error deleting case:", err);
      }
    }
  };

  // When editCase changes, copy its data into editFormData for controlled editing
  useEffect(() => {
    if (editCase) {
      // Helper to format date to yyyy-mm-dd for input type=date
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d)) return "";
        return d.toISOString().slice(0, 10);
      };
      setEditFormData({
        ...editCase,
        caseNo: editCase.caseNo || "",
        caseType: editCase.caseType || "Normal",
        caseTitle: editCase.caseTitle || "",
        department: editCase.ministry || "",
        fileNo: editCase.fileNo || "",
        revenue: editCase.revenue || "",
        status:
          typeof editCase.status === "object" && editCase.status?._id
            ? editCase.status._id
            : editCase.status || "",
        court:
          typeof editCase.court === "object" && editCase.court?._id
            ? editCase.court._id
            : editCase.court || "",
        location:
          typeof editCase.location === "object" && editCase.location?._id
            ? editCase.location._id
            : editCase.location || "",
        bench: editCase.bench || "",
        judges:
          Array.isArray(editCase.judges) && editCase.judges.length > 0
            ? typeof editCase.judges[0] === "object" && editCase.judges[0]?._id
              ? editCase.judges[0]._id
              : editCase.judges[0]
            : typeof editCase.judges === "object" && editCase.judges?._id
            ? editCase.judges._id
            : editCase.judges || "",
        subjectMatter:
          typeof editCase.subjectMatter === "object" &&
          editCase.subjectMatter?._id
            ? editCase.subjectMatter._id
            : editCase.subjectMatter || "",
        totalJudges: editCase.totalJudges || "",
        remarks: editCase.initialRemarks || "",
        hearingDate: formatDate(editCase.hearingDate),
        nextHearingDate: formatDate(editCase.nextHearingDate),
        focalPerson: editCase.focalPersonName || "",
        contact: editCase.contact || "",
        advocate: editCase.lawOfficer || "",
      });
    } else {
      setEditFormData(null);
    }
  }, [editCase]);

  return (
    <div className="departments-table">
      {/* Inline Edit Form at the top */}
      {editFormData && (
        <div style={{ margin: "20px 0" }}>
          <CaseForm
            formData={editFormData}
            setFormData={setEditFormData}
            onCancel={() => setEditCase(null)}
            onSubmit={async (e) => {
              e.preventDefault();
              await handleUpdateCase(editFormData);
            }}
            isEdit={true}
            key={editFormData._id || "edit-form"}
          />
        </div>
      )}

      <div className="courts-header">
        <h2>Cases</h2>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search Cases..."
        />
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          Add Case
        </button>
      </div>

      <div className="departments-table">
        <div
          className="departments-table-header"
          style={{
            display: "grid",
            gridTemplateColumns: "50px 1.5fr 2fr 1.2fr 1.5fr 2fr 1.2fr 160px",
            alignItems: "center",
          }}
        >
          <span>S.No</span>
          <span>Case No</span>
          <span>Title</span>
          <span>Status</span>
          <span>Department</span>
          <span>Subject Matter</span>
          <span>Next Hearing</span>
          <span>Actions</span>
        </div>

        {filteredCases.map((c, index) => (
          <div
            className="departments-table-row"
            key={c._id}
            style={{
              display: "grid",
              gridTemplateColumns: "50px 1.5fr 2fr 1.2fr 1.5fr 2fr 1.2fr 160px",
              alignItems: "center",
            }}
          >
            <span>{index + 1}</span>
            <span>{c.caseNo}</span>
            <span>{c.caseTitle}</span>
            <span>{getStatusName(c.status)}</span>
            <span>{c.ministry}</span>
            <span>
              {c.subjectMatter && typeof c.subjectMatter === "object"
                ? c.subjectMatter.name || c.subjectMatter._id || "–"
                : c.subjectMatter || "–"}
            </span>
            <span>
              {c.nextHearingDate && !isNaN(new Date(c.nextHearingDate))
                ? new Date(c.nextHearingDate).toLocaleDateString()
                : "–"}
            </span>
            <span style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-edit"
                onClick={async () => {
                  try {
                    const res = await axios.get(
                      `http://localhost:5000/api/cases/${c._id}`
                    );
                    setEditCase(res.data);
                  } catch (err) {
                    alert("Failed to fetch case details for editing.");
                  }
                }}
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteCase(c._id)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasesList;
