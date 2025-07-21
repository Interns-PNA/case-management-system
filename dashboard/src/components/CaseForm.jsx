import React, { useEffect, useState } from "react";
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

  const [courts, setCourts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [judges, setJudges] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDropdownData();
    fetchDepartments();
  }, []);

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
    if (onSubmit) {
      // Edit mode: delegate to parent
      await onSubmit(e);
      return;
    }
    // Add mode: local submit
    try {
      // Map department to ministry for backend
      const submitData = { ...data, ministry: data.department };
      delete submitData.department;
      await axios.post("http://localhost:5000/api/cases", submitData);
      alert("Case submitted successfully!");
      onCancel(); // to close the form
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit case.");
    }
  };

  return (
    <div className="case-form-container">
      <form className="case-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Case Details</legend>

          <div className="form-row">
            <input
              type="text"
              placeholder="Case No *"
              name="caseNo"
              value={data.caseNo}
              onChange={handleChange}
              required
            />
            <select
              name="caseType"
              value={data.caseType}
              onChange={handleChange}
              required
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            <input
              type="text"
              placeholder="Case Title *"
              name="caseTitle"
              value={data.caseTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <select
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

          <div className="form-row">
            <input
              type="text"
              placeholder="File No"
              name="fileNo"
              value={data.fileNo}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Revenue (In Million)"
              name="revenue"
              value={data.revenue}
              onChange={handleChange}
            />
            <select
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

          <div className="form-row">
            <select
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

            <select
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

            <select name="bench" value={data.bench} onChange={handleChange}>
              <option>Select Bench</option>
              <option value="Bench A">Bench A</option>
              <option value="Bench B">Bench B</option>
            </select>
          </div>

          <div className="form-row">
            <select
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

            <select
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

            <input
              type="text"
              name="totalJudges"
              placeholder="Total Judges"
              value={data.totalJudges}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <textarea
              placeholder="Initial Remarks *"
              rows="3"
              name="remarks"
              value={data.remarks}
              onChange={handleChange}
              required
            ></textarea>
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
            <input
              type="text"
              name="focalPerson"
              placeholder="Focal Person Name"
              value={data.focalPerson}
              onChange={handleChange}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={data.contact}
              onChange={handleChange}
            />
            <input
              type="text"
              name="advocate"
              placeholder="Advocate/Law Officer (if any)"
              value={data.advocate}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <div className="form-row form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
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
