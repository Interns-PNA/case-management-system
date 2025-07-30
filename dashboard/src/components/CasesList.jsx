import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";
import { Edit, Trash2, Eye } from "lucide-react";
import CaseForm from "./CaseForm";
import { Link, useLocation } from "react-router-dom";

const CasesList = () => {
  const { canWrite } = useAuth();
  const location = useLocation();
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editCase, setEditCase] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewCase, setViewCase] = useState(null);
  const [benches, setBenches] = useState([]);

  useEffect(() => {
    fetchCases();
    fetchStatuses();
    fetchBenches();
  }, [location.search]);

  const fetchBenches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/benches");
      setBenches(res.data);
    } catch (err) {
      console.error("Error fetching benches:", err);
    }
  };

  const fetchCases = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const status = params.get("status");
      const hearingDate = params.get("hearingDate");
      const upcomingFrom = params.get("upcomingFrom");

      let apiUrl = "http://localhost:5000/api/cases";
      const queryParams = new URLSearchParams();

      if (status) {
        queryParams.append("status", status);
      }
      if (hearingDate) {
        queryParams.append("startDate", hearingDate);
        queryParams.append("endDate", hearingDate);
      }
      if (upcomingFrom) {
        queryParams.append("startDate", upcomingFrom);
      }

      if (queryParams.toString()) {
        apiUrl += `?${queryParams.toString()}`;
      }

      const res = await axios.get(apiUrl);
      setCases(res.data);
      setFilteredCases(res.data); // Always update filtered cases from fetch

      // Set search term for display, but don't trigger filtering
      if (status) {
        setSearchTerm(status);
      } else {
        setSearchTerm(""); // Clear search term if no status filter
      }
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
    if (term.trim() === "") {
      setFilteredCases(cases); // If search is cleared, show all fetched cases
      return;
    }
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
      // Check if updatedCase is FormData (for file uploads) or regular object
      const isFormData = updatedCase instanceof FormData;

      console.log("Updating case, isFormData:", isFormData);
      if (isFormData) {
        console.log("FormData keys:", Array.from(updatedCase.keys()));
      } else {
        console.log("Regular object keys:", Object.keys(updatedCase));
      }

      if (isFormData) {
        // For FormData (file uploads), we need to add the ID separately
        const caseId = editCase._id;
        console.log("Updating case with ID:", caseId);
        await axios.put(
          `http://localhost:5000/api/cases/${caseId}`,
          updatedCase,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // For regular JSON updates
        await axios.put(
          `http://localhost:5000/api/cases/${updatedCase._id}`,
          updatedCase
        );
      }

      fetchCases();
      setEditCase(null);
      setEditFormData(null);
      alert("Case updated successfully!");
    } catch (err) {
      console.error("Error updating case:", err);
      console.error("Error response:", err.response?.data);
      alert(
        `Failed to update case: ${err.response?.data?.error || err.message}`
      );
    }
  };

  const handleDeleteCase = async (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cases/${id}`);
        // If the deleted case is being edited, close the edit modal
        if (editCase && editCase._id === id) {
          setEditCase(null);
          setEditFormData(null);
        }
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
        department: editCase.department || editCase.ministry || "",
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
          Array.isArray(editCase.location) && editCase.location.length > 0
            ? typeof editCase.location[0] === "object" &&
              editCase.location[0]?._id
              ? editCase.location[0]._id
              : editCase.location[0]
            : typeof editCase.location === "object" && editCase.location?._id
            ? editCase.location._id
            : editCase.location || "",
        bench: editCase.bench || "",
        judges:
          Array.isArray(editCase.judges) && editCase.judges.length > 0
            ? editCase.judges.map((judge) =>
                typeof judge === "object" && judge?._id ? judge._id : judge
              )
            : typeof editCase.judges === "object" && editCase.judges?._id
            ? [editCase.judges._id]
            : editCase.judges
            ? [editCase.judges]
            : [],
        subjectMatter:
          typeof editCase.subjectMatter === "object" &&
          editCase.subjectMatter?._id
            ? editCase.subjectMatter._id
            : editCase.subjectMatter || "",
        totalJudges: editCase.totalJudges || "",
        remarks: editCase.initialRemarks || editCase.remarks || "",
        hearingDate: formatDate(editCase.hearingDate),
        nextHearingDate: formatDate(editCase.nextHearingDate),
        focalPerson: editCase.focalPersonName || editCase.focalPerson || "",
        contact: editCase.contact || "",
        advocate: editCase.lawOfficer || editCase.advocate || "",
      });
    } else {
      setEditFormData(null);
    }
  }, [editCase]);

  return (
    <div>
      {/* Inline Edit Form at the top */}
      {editFormData && (
        <div style={{ margin: "20px 0" }}>
          <CaseForm
            formData={editFormData}
            setFormData={setEditFormData}
            onCancel={() => {
              setEditCase(null);
              setEditFormData(null);
            }}
            onSubmit={async (e, submitData) => {
              // submitData is already mapped for backend
              await handleUpdateCase(submitData);
            }}
            isEdit={true}
            key={editFormData._id || "edit-form"}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 20px 0 20px",
          margin: "0px",
        }}
        className="courts-header"
      >
        <h2>Cases</h2>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search Cases..."
        />
        <div style={{ width: "100px", height: "40px" }}></div>
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
                className="btn-view"
                style={{
                  background: "#3498db",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={async () => {
                  try {
                    const res = await axios.get(
                      `http://localhost:5000/api/cases/${c._id}`
                    );
                    setViewCase(res.data);
                  } catch {
                    alert("Failed to fetch case details for viewing.");
                  }
                }}
                title="View"
              >
                <Eye size={18} />
              </button>
              {canWrite() && (
                <>
                  <button
                    className="btn-edit"
                    onClick={async () => {
                      try {
                        const res = await axios.get(
                          `http://localhost:5000/api/cases/${c._id}`
                        );
                        setEditCase(res.data);
                      } catch {
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
                </>
              )}
            </span>
            {/* View Modal */}
            {viewCase && (
              <div className="modal-overlay" style={{ zIndex: 1000 }}>
                <div
                  className="modal"
                  style={{ minWidth: 400, maxWidth: 600, position: "relative" }}
                >
                  <button
                    className="btn-cancel"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 16,
                      fontSize: 32,
                      background: "none",
                      border: "none",
                      color: "#888",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => setViewCase(null)}
                    title="Close"
                  >
                    &times;
                  </button>
                  <h2 style={{ marginBottom: 12, color: "#2f80ed" }}>
                    Case Summary
                  </h2>
                  <div
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <strong>Case No:</strong> {viewCase.caseNo}
                    </div>
                    <div>
                      <strong>Title:</strong> {viewCase.caseTitle}
                    </div>
                    <div>
                      <strong>Status:</strong> {viewCase.status}
                    </div>
                    <div>
                      <strong>Department:</strong> {viewCase.ministry}
                    </div>
                    <div>
                      <strong>Court:</strong>{" "}
                      {viewCase.court?.name || viewCase.court}
                    </div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {viewCase.location?.name || viewCase.location}
                    </div>
                    <div>
                      <strong>Bench:</strong>{" "}
                      {(() => {
                        if (!viewCase.bench) return "–";
                        if (
                          typeof viewCase.bench === "object" &&
                          viewCase.bench.name
                        )
                          return viewCase.bench.name;
                        const foundBench = benches.find(
                          (b) => b._id === viewCase.bench
                        );
                        return foundBench ? foundBench.name : viewCase.bench;
                      })()}
                    </div>
                    <div>
                      <strong>Judge:</strong>{" "}
                      {Array.isArray(viewCase.judges)
                        ? viewCase.judges.map((j) => j.name || j).join(", ")
                        : viewCase.judges}
                    </div>
                    <div>
                      <strong>Subject Matter:</strong>{" "}
                      {viewCase.subjectMatter?.name || viewCase.subjectMatter}
                    </div>
                    <div>
                      <strong>Next Hearing:</strong>{" "}
                      {viewCase.nextHearingDate
                        ? new Date(
                            viewCase.nextHearingDate
                          ).toLocaleDateString()
                        : "–"}
                    </div>
                    <div>
                      <strong>Initial Remarks:</strong>{" "}
                      {viewCase.initialRemarks || viewCase.remarks}
                    </div>
                  </div>
                  {/* PDF or image preview placeholder */}
                  {viewCase.files && viewCase.files.length > 0 ? (
                    <div style={{ marginBottom: 16 }}>
                      <strong>Attached File:</strong>
                      <br />
                      {viewCase.files[0].endsWith(".pdf") ? (
                        <iframe
                          src={viewCase.files[0]}
                          width="100%"
                          height="400px"
                          title="Case PDF"
                        />
                      ) : (
                        <img
                          src={viewCase.files[0]}
                          alt="Case Attachment"
                          style={{ maxWidth: "100%", maxHeight: 400 }}
                        />
                      )}
                    </div>
                  ) : (
                    <div style={{ marginBottom: 16, color: "#888" }}>
                      No PDF or image attached.
                    </div>
                  )}

                  {/* Print/Export Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 24,
                    }}
                  >
                    <button
                      style={{
                        background: "#2f80ed",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px 24px",
                        fontSize: "16px",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(47,128,237,0.08)",
                      }}
                      onClick={() => {
                        const win = window.open("", "_blank");
                        win.document.write(`
                          <html>
                            <head>
                              <title>Case Summary Document</title>
                              <style>
                                @media print {
                                  @page { size: A4; margin: 20mm; }
                                }
                                body { font-family: Arial, sans-serif; background: #fff; margin: 0; padding: 0; }
                                .a4 {
                                  width: 210mm;
                                  min-height: 297mm;
                                  margin: auto;
                                  background: #fff;
                                  box-shadow: 0 0 8px #ccc;
                                  padding: 32px 40px;
                                }
                                .court-header {
                                  text-align: center;
                                  font-size: 1.5em;
                                  font-weight: bold;
                                  margin-bottom: 18px;
                                  letter-spacing: 1px;
                                }
                                table {
                                  width: 100%;
                                  border-collapse: collapse;
                                  margin-bottom: 18px;
                                }
                                th, td {
                                  border: 1px solid #bbb;
                                  padding: 8px 10px;
                                  font-size: 15px;
                                  text-align: left;
                                }
                                th {
                                  background: #f2f2f2;
                                  font-weight: bold;
                                }
                                .section-title {
                                  font-weight: bold;
                                  margin-top: 18px;
                                  margin-bottom: 8px;
                                  font-size: 1.1em;
                                  color: #2f80ed;
                                }
                                ul {
                                  margin: 0 0 0 18px;
                                  padding: 0;
                                }
                                li {
                                  margin-bottom: 6px;
                                  font-size: 15px;
                                }
                              </style>
                            </head>
                            <body>
                              <div class="a4">
                                <div class="court-header">${
                                  typeof viewCase.court === "object" &&
                                  viewCase.court?.name
                                    ? viewCase.court.name
                                    : typeof viewCase.court === "string"
                                    ? viewCase.court
                                    : "Court"
                                }</div>
                                <table>
                                  <tr>
                                    <th>File No.</th>
                                    <td>${viewCase.fileNo || "–"}</td>
                                    <th>Case Title</th>
                                    <td>${viewCase.caseTitle || "–"}</td>
                                  </tr>
                                  <tr>
                                    <th>Case No.</th>
                                    <td>${viewCase.caseNo || "–"}</td>
                                    <th>Petitioner/Respondent</th>
                                    <td>${
                                      viewCase.petitionerRespondent || "–"
                                    }</td>
                                  </tr>
                                  <tr>
                                    <th>Counsel / Law Officer</th>
                                    <td>${
                                      viewCase.lawOfficer ||
                                      viewCase.advocate ||
                                      "–"
                                    }</td>
                                    <th>Court</th>
                                    <td>${
                                      viewCase.court?.name ||
                                      viewCase.court ||
                                      "–"
                                    }</td>
                                  </tr>
                                </table>
                                <div class="section-title">Brief Facts of the Case</div>
                                <ul>
                                  <li><strong>Status:</strong> ${
                                    viewCase.status || "–"
                                  }</li>
                                  <li><strong>Department:</strong> ${
                                    viewCase.ministry || "–"
                                  }</li>
                                  <li><strong>Location:</strong> ${
                                    viewCase.location?.name ||
                                    viewCase.location ||
                                    "–"
                                  }</li>
                                  <li><strong>Bench:</strong> ${(() => {
                                    if (!viewCase.bench) return "–";
                                    if (
                                      typeof viewCase.bench === "object" &&
                                      viewCase.bench.name
                                    )
                                      return viewCase.bench.name;
                                    const foundBench = benches.find(
                                      (b) => b._id === viewCase.bench
                                    );
                                    return foundBench
                                      ? foundBench.name
                                      : viewCase.bench;
                                  })()}</li>
                                  <li><strong>Judge:</strong> ${
                                    Array.isArray(viewCase.judges)
                                      ? viewCase.judges
                                          .map((j) => j.name || j)
                                          .join(", ")
                                      : viewCase.judges || "–"
                                  }</li>
                                  <li><strong>Subject Matter:</strong> ${
                                    viewCase.subjectMatter?.name ||
                                    viewCase.subjectMatter ||
                                    "–"
                                  }</li>
                                  <li><strong>Next Hearing:</strong> ${
                                    viewCase.nextHearingDate
                                      ? new Date(
                                          viewCase.nextHearingDate
                                        ).toLocaleDateString()
                                      : "–"
                                  }</li>
                                  <li><strong>Initial Remarks:</strong> ${
                                    viewCase.initialRemarks ||
                                    viewCase.remarks ||
                                    "–"
                                  }</li>
                                </ul>
                                
                              </div>
                            </body>
                          </html>
                        `);
                        win.document.close();
                      }}
                    >
                      Print / Export PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ minWidth: 400 }}>
            <h3>Add New Case</h3>
            <p>Add case functionality would go here.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesList;
