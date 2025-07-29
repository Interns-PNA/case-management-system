import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseForm.css";
import axios from "axios";

// Helper component for file status display
const FileStatusDisplay = ({ isEdit, formData, fileInputId }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const fileInput = document.getElementById(fileInputId);
    const handleFileChange = () => forceUpdate({});

    if (fileInput) {
      fileInput.addEventListener("change", handleFileChange);
      return () => fileInput.removeEventListener("change", handleFileChange);
    }
  }, [fileInputId]);

  const fileInput = document.getElementById(fileInputId);
  const hasNewFile = fileInput && fileInput.files && fileInput.files.length > 0;
  const hasExistingFile =
    isEdit && formData && formData.files && formData.files.length > 0;

  if (hasNewFile) {
    return (
      <span style={{ fontSize: "14px", color: "#666" }}>
        File selected: {fileInput.files[0].name}
      </span>
    );
  } else if (hasExistingFile) {
    return (
      <span style={{ fontSize: "14px", color: "#666" }}>
        Current file:
        <a
          href={`http://localhost:5000/uploads/${formData.files[0]}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "6px", color: "#2f80ed" }}
        >
          {formData.files[0]}
        </a>
        <span style={{ marginLeft: "6px", fontSize: "12px" }}>
          (Upload a new file to replace)
        </span>
      </span>
    );
  } else {
    return (
      <span style={{ fontSize: "14px", color: "#999" }}>No file chosen</span>
    );
  }
};

// Helper component for remark file status display
const RemarkFileStatusDisplay = ({ remark, fileInputId }) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const fileInput = document.getElementById(fileInputId);
    const handleFileChange = () => forceUpdate({});

    if (fileInput) {
      fileInput.addEventListener("change", handleFileChange);
      return () => fileInput.removeEventListener("change", handleFileChange);
    }
  }, [fileInputId]);

  const fileInput = document.getElementById(fileInputId);
  const hasNewFile = fileInput && fileInput.files && fileInput.files.length > 0;
  const hasExistingFile =
    remark.file && typeof remark.file === "string" && remark.file !== "";

  if (hasNewFile) {
    return (
      <span style={{ fontSize: "14px", color: "#666" }}>
        File selected: {fileInput.files[0].name}
      </span>
    );
  } else if (hasExistingFile) {
    return (
      <span style={{ fontSize: "14px", color: "#666" }}>
        Current file:
        <a
          href={`http://localhost:5000/uploads/${remark.file}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "6px", color: "#2f80ed" }}
        >
          {remark.file}
        </a>
        <span style={{ marginLeft: "6px", fontSize: "12px" }}>
          (Upload a new file to replace)
        </span>
      </span>
    );
  } else {
    return (
      <span style={{ fontSize: "14px", color: "#999" }}>No file chosen</span>
    );
  }
};

export const defaultForm = {
  caseNo: "",
  caseType: "Normal",
  caseTitle: "",
  department: "",
  fileNo: "",
  revenue: "",
  status: "",
  court: "",
  location: "",
  bench: "",
  judges: "",
  subjectMatter: "",
  totalJudges: "",
  remarks: "",
  hearingDate: "",
  nextHearingDate: "",
  focalPerson: "",
  contact: "",
  advocate: "",
};

const CaseForm = ({ formData, setFormData, onCancel, onSubmit, isEdit }) => {
  // If formData/setFormData are not provided, use local state (for Add mode)
  const [localFormData, setLocalFormData] = useState(defaultForm);
  const isControlled = !!formData && !!setFormData;
  const data = isControlled ? formData : localFormData;
  const setData = isControlled ? setFormData : setLocalFormData;

  const navigate = useNavigate();

  const [courts, setCourts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [judges, setJudges] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [benches, setBenches] = useState([]);
  // State for dynamic case remarks
  const [caseRemarks, setCaseRemarks] = useState([]);

  // Load existing remarks in edit mode, format date for input
  useEffect(() => {
    if (isEdit && formData && Array.isArray(formData.caseRemarks)) {
      setCaseRemarks(
        formData.caseRemarks.map((r, idx) => ({
          ...r,
          date: r.date ? new Date(r.date).toISOString().slice(0, 10) : "",
          id: r.id || `${idx}_${Date.now()}_${Math.random()}`,
        }))
      );
    } else if (!isEdit) {
      setCaseRemarks([]);
    }
  }, [isEdit, formData]);

  // Handler to add a new case remark
  const handleAddRemark = () => {
    setCaseRemarks((prev) => [
      ...prev,
      { date: "", remarks: "", file: null, id: Date.now() + Math.random() },
    ]);
  };

  // Handler to remove a case remark by id
  const handleRemoveRemark = (id) => {
    setCaseRemarks((prev) => prev.filter((r) => r.id !== id));
  };

  // Handler to update a field in a case remark
  const handleRemarkChange = (id, field, value) => {
    setCaseRemarks((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === "file") {
          // Store actual file object for new uploads, keep string for existing files
          return { ...r, file: value || "" };
        }
        return { ...r, [field]: value };
      })
    );
  };

  useEffect(() => {
    fetchDropdownData();
    fetchDepartments();
    fetchBenches();
  }, []);
  const fetchBenches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/benches");
      setBenches(res.data);
    } catch (error) {
      console.error("Bench fetch failed:", error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [courtRes, locationRes, judgeRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/api/courts"),
        axios.get("http://localhost:5000/api/locations"),
        axios.get("http://localhost:5000/api/judges"),
        axios.get("http://localhost:5000/api/subject-matter"),
      ]);
      setCourts(courtRes.data);
      setLocations(locationRes.data);
      setJudges(judgeRes.data);
      setSubjects(subjectRes.data);
    } catch (error) {
      console.error("Dropdown fetch failed:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error("Department fetch failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file uploads
    const formData = new FormData();

    // Prepare data for backend
    let submitData = { ...data };
    // Map department to ministry
    submitData.ministry = data.department;
    delete submitData.department;
    // Map remarks to initialRemarks
    submitData.initialRemarks = data.remarks;
    delete submitData.remarks;
    // Judges: always send as array of ObjectId(s)
    if (submitData.judges && !Array.isArray(submitData.judges)) {
      submitData.judges = [submitData.judges];
    }
    // Convert totalJudges and revenue to numbers if present
    if (submitData.totalJudges)
      submitData.totalJudges = Number(submitData.totalJudges);
    if (submitData.revenue) submitData.revenue = Number(submitData.revenue);
    // Map advocate to lawOfficer
    if (submitData.advocate) {
      submitData.lawOfficer = submitData.advocate;
      delete submitData.advocate;
    }
    // Map focalPerson to focalPersonName
    if (submitData.focalPerson) {
      submitData.focalPersonName = submitData.focalPerson;
      delete submitData.focalPerson;
    }
    // Remove empty string fields
    Object.keys(submitData).forEach((k) => {
      if (submitData[k] === "") delete submitData[k];
    });

    // Remove _id from submitData as it should not be part of the update data
    delete submitData._id;

    // Prepare caseRemarks for submission
    const remarksForSubmission = caseRemarks.map(({ date, remarks, file }) => ({
      date,
      remarks,
      file: typeof file === "string" ? file : "",
    }));
    submitData.caseRemarks = remarksForSubmission;

    // Add text fields to FormData
    Object.keys(submitData).forEach((key) => {
      if (key === "caseRemarks") {
        formData.append(key, JSON.stringify(submitData[key]));
      } else if (Array.isArray(submitData[key])) {
        formData.append(key, JSON.stringify(submitData[key]));
      } else {
        formData.append(key, submitData[key]);
      }
    });

    // Note: _id is handled via URL parameter in edit mode, not in FormData

    // Add main case file if present
    const caseFileInput = document.getElementById("caseFile");
    if (caseFileInput && caseFileInput.files[0]) {
      formData.append("caseFile", caseFileInput.files[0]);
    }

    // Add case remark files
    caseRemarks.forEach((remark, index) => {
      if (remark.file && typeof remark.file === "object") {
        formData.append(`remarkFile_${index}`, remark.file);
      }
    });

    if (onSubmit) {
      // Edit mode: delegate to parent, pass formData
      await onSubmit(e, formData);
      return;
    }

    // Add mode: local submit
    try {
      await axios.post("http://localhost:5000/api/cases", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Case submitted successfully!");
      if (onCancel) onCancel(); // to close the form
    } catch (error) {
      console.error("Submit failed:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert("Failed to submit case: " + error.response.data.error);
      } else {
        alert("Failed to submit case.");
      }
    }
  };

  return (
    <div className="case-form-container">
      <form className="case-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Case Details</legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="caseNo">Case No *</label>
              <input
                type="text"
                id="caseNo"
                placeholder="Case No *"
                name="caseNo"
                value={data.caseNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="caseType">Case Type *</label>
              <select
                id="caseType"
                name="caseType"
                value={data.caseType}
                onChange={handleChange}
                required
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="caseTitle">Case Title *</label>
              <input
                type="text"
                id="caseTitle"
                placeholder="Case Title *"
                name="caseTitle"
                value={data.caseTitle}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Ministry/Division/Department *</label>
              <select
                id="department"
                name="department"
                value={data.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Ministry/Division/Department *</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fileNo">File No</label>
              <input
                type="text"
                id="fileNo"
                placeholder="File No"
                name="fileNo"
                value={data.fileNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="revenue">Revenue (In Million)</label>
              <input
                type="text"
                id="revenue"
                placeholder="Revenue (In Million)"
                name="revenue"
                value={data.revenue}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={data.status}
                onChange={handleChange}
                required
              >
                <option value="">Status *</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="court">Court *</label>
              <select
                id="court"
                name="court"
                value={data.court}
                onChange={handleChange}
                required
              >
                <option value="">Select Court</option>
                {courts.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <select
                id="location"
                name="location"
                value={data.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="bench">Bench *</label>
              <select
                id="bench"
                name="bench"
                value={data.bench}
                onChange={handleChange}
                required
              >
                <option value="">Select Bench</option>
                {benches.map((b) => (
                  <option key={b._id} value={b._id || b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="judges">Judge *</label>
              <select
                id="judges"
                name="judges"
                value={data.judges}
                onChange={handleChange}
                required
              >
                <option value="">Select Judge</option>
                {judges.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subjectMatter">Subject Matter *</label>
              <select
                id="subjectMatter"
                name="subjectMatter"
                value={data.subjectMatter}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject Matter</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="totalJudges">Total Judges *</label>
              <input
                type="text"
                id="totalJudges"
                name="totalJudges"
                placeholder="Total Judges"
                value={data.totalJudges}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ width: "100%" }}>
              <label htmlFor="remarks">Initial Remarks *</label>
              <textarea
                id="remarks"
                placeholder="Initial Remarks *"
                rows="3"
                name="remarks"
                value={data.remarks}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hearingDate">Hearing Date</label>
              <input
                type="date"
                id="hearingDate"
                name="hearingDate"
                value={data.hearingDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nextHearingDate">Next Hearing Date</label>
              <input
                type="date"
                id="nextHearingDate"
                name="nextHearingDate"
                value={data.nextHearingDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="caseFile">Upload File</label>
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  id="caseFile"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: "100%",
                    height: "42px",
                    cursor: "pointer",
                  }}
                  onChange={() => {
                    // Force re-render to update the file display
                    setData((prev) => ({ ...prev, _fileChanged: Date.now() }));
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    height: "42px",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "4px 0 0 4px",
                      fontSize: "14px",
                      fontWeight: "500",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      boxSizing: "border-box",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    Choose File
                  </span>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <FileStatusDisplay
                    isEdit={isEdit}
                    formData={formData}
                    fileInputId="caseFile"
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Departments Focal Person & Advocate Details</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="focalPerson">Focal Person Name</label>
              <input
                type="text"
                id="focalPerson"
                name="focalPerson"
                placeholder="Focal Person Name"
                value={data.focalPerson}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                id="contact"
                name="contact"
                placeholder="Contact"
                value={data.contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="advocate">Advocate/Law Officer (if any)</label>
              <input
                type="text"
                id="advocate"
                name="advocate"
                placeholder="Advocate/Law Officer (if any)"
                value={data.advocate}
                onChange={handleChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Case Remarks Section */}
        <div style={{ margin: "1.5rem 0" }}>
          <h4>Case Remarks</h4>
          <br />
          {caseRemarks.map((remark) => (
            <div
              key={remark.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                position: "relative",
                borderRadius: "6px",
              }}
            >
              <button
                type="button"
                onClick={() => handleRemoveRemark(remark.id)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#c00",
                }}
                title="Remove"
              >
                x
              </button>
              <div className="form-row">
                <div style={{ maxHeight: "80px" }} className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={remark.date}
                    onChange={(e) =>
                      handleRemarkChange(remark.id, "date", e.target.value)
                    }
                  />
                </div>
                <div style={{ maxHeight: "80px" }} className="form-group">
                  <label>Hearing Remarks</label>
                  <textarea
                    placeholder="Hearing Remarks (optional)"
                    rows={3}
                    value={remark.remarks}
                    onChange={(e) =>
                      handleRemarkChange(remark.id, "remarks", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>File Attachment</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="file"
                      id={`remarkFile-${remark.id}`}
                      style={{
                        position: "absolute",
                        opacity: 0,
                        width: "100%",
                        height: "42px",
                        cursor: "pointer",
                      }}
                      onChange={(e) =>
                        handleRemarkChange(remark.id, "file", e.target.files[0])
                      }
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                        height: "42px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#007bff",
                          color: "white",
                          padding: "8px 12px",
                          borderRadius: "4px 0 0 4px",
                          fontSize: "14px",
                          fontWeight: "500",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          boxSizing: "border-box",
                          width: "100%",
                          justifyContent: "center",
                        }}
                      >
                        Choose File
                      </span>
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <RemarkFileStatusDisplay
                        remark={remark}
                        fileInputId={`remarkFile-${remark.id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRemark}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0.5rem 1rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>+</span>{" "}
            Add Case Remarks
          </button>
        </div>

        <div className="form-row form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              if (isEdit) {
                if (onCancel) onCancel();
              } else {
                navigate("/dashboard");
              }
            }}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
