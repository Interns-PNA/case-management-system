import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseForm.css";
import axios from "axios";

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
  // State for selected judges (multiple selection)
  const [selectedJudges, setSelectedJudges] = useState([]);
  // State for judge dropdown visibility
  const [isJudgeDropdownOpen, setIsJudgeDropdownOpen] = useState(false);

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

  // Load selected judges in edit mode
  useEffect(() => {
    if (isEdit && formData && formData.judges) {
      // If judges is already an array, use it directly
      if (Array.isArray(formData.judges)) {
        setSelectedJudges(formData.judges);
      } else {
        // If it's a single judge, convert to array
        setSelectedJudges([formData.judges]);
      }
    } else if (!isEdit) {
      setSelectedJudges([]);
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
          // Only store file name (string) for backend
          return { ...r, file: value && value.name ? value.name : "" };
        }
        return { ...r, [field]: value };
      })
    );
  };

  // Handler for judge selection
  const handleJudgeSelection = (judgeId) => {
    setSelectedJudges((prev) => {
      if (prev.includes(judgeId)) {
        // Remove judge if already selected
        return prev.filter((id) => id !== judgeId);
      } else {
        // Add judge if not selected
        return [...prev, judgeId];
      }
    });
  };

  // Handler to toggle judge dropdown
  const toggleJudgeDropdown = () => {
    setIsJudgeDropdownOpen(!isJudgeDropdownOpen);
  };

  // Get selected judge names for display
  const getSelectedJudgeNames = () => {
    const judgeNames = selectedJudges
      .map((judgeId) => {
        const judge = judges.find((j) => j._id === judgeId);
        return judge ? judge.name : "";
      })
      .filter((name) => name);
    
    if (judgeNames.length === 0) return "";
    if (judgeNames.length === 1) return judgeNames[0];
    if (judgeNames.length === 2) return judgeNames.join(" & ");
    return `${judgeNames[0]} & ${judgeNames.length - 1} more`;
  };

  // Get full list of selected judge names for tooltip
  const getFullJudgeNames = () => {
    return selectedJudges
      .map((judgeId) => {
        const judge = judges.find((j) => j._id === judgeId);
        return judge ? judge.name : "";
      })
      .filter((name) => name)
      .join(", ");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownContainer = document.querySelector('.judge-dropdown-container');
      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        setIsJudgeDropdownOpen(false);
      }
    };

    if (isJudgeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isJudgeDropdownOpen]);

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
    
    // Validate that at least one judge is selected
    if (selectedJudges.length === 0) {
      alert("Please select at least one judge");
      return;
    }
    
    // Prepare data for backend
    let submitData = { ...data };
    // Map department to ministry
    submitData.ministry = data.department;
    delete submitData.department;
    // Map remarks to initialRemarks
    submitData.initialRemarks = data.remarks;
    delete submitData.remarks;
    // Judges: use selected judges array
    submitData.judges = selectedJudges;
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
    // Attach caseRemarks to submitData (remove id field before sending, and only send file as string)
    submitData.caseRemarks = caseRemarks.map(({ date, remarks, file }) => ({
      date,
      remarks,
      file:
        typeof file === "string" ? file : file && file.name ? file.name : "",
    }));
    if (onSubmit) {
      // Edit mode: delegate to parent, pass submitData
      await onSubmit(e, submitData);
      return;
    }
    // Add mode: local submit
    try {
      await axios.post("http://localhost:5000/api/cases", submitData);
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
            <div className="form-group" style={{ flex: "2" }}>
              <label htmlFor="judges">Judge(s) *</label>
              <div className="judge-dropdown-container">
                <div
                  className="judge-selector"
                  onClick={toggleJudgeDropdown}
                >
                  <span 
                    style={{ 
                      color: selectedJudges.length > 0 ? "#000" : "#666",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      lineHeight: "1.4"
                    }}
                    title={selectedJudges.length > 2 ? getFullJudgeNames() : ""}
                  >
                    {selectedJudges.length > 0 
                      ? getSelectedJudgeNames() 
                      : "Select Judge(s)"}
                  </span>
                  <span style={{ fontSize: "12px" }}>▼</span>
                </div>
                
                {isJudgeDropdownOpen && (
                  <div className="judge-dropdown">
                    {judges.map((judge) => (
                      <div
                        key={judge._id}
                        onClick={() => handleJudgeSelection(judge._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedJudges.includes(judge._id)}
                          onChange={() => {}} // Controlled by onClick
                        />
                        <span>{judge.name}</span>
                      </div>
                    ))}
                    {judges.length === 0 && (
                      <div style={{ padding: "8px 12px", color: "#666" }}>
                        No judges available
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedJudges.length === 0 && (
                <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "4px" }}>
                  Please select at least one judge
                </div>
              )}
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
              <input type="file" id="caseFile" />
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
                ×
              </button>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={remark.date}
                    onChange={(e) =>
                      handleRemarkChange(remark.id, "date", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
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
                  <input
                    type="file"
                    onChange={(e) =>
                      handleRemarkChange(remark.id, "file", e.target.files[0])
                    }
                  />
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
