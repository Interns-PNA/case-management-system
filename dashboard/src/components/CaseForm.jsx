import React, { useEffect, useState } from 'react';
import './CaseForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CaseForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    caseNo: '',
    caseType: '',
    caseTitle: '',
    department: '',
    fileNo: '',
    revenue: '',
    status: '',
    court: '',
    location: '',
    bench: '',
    judges: '',
    subjectMatter: '',
    totalJudges: '',
    remarks: '',
    hearingDate: '',
    nextHearingDate: '',
    focalPerson: '',
    contact: '',
    advocate: ''
  });

  const [courts, setCourts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [judges, setJudges] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [benches, setBenches] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [courtRes, locationRes, judgeRes, subjectRes, statusesRes, benchesRes, departmentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/courts'),
        axios.get('http://localhost:5000/api/locations'),
        axios.get('http://localhost:5000/api/judges'),
        axios.get('http://localhost:5000/api/subject-matter'),
        axios.get('http://localhost:5000/api/statuses'),
        axios.get('http://localhost:5000/api/benches'),
        axios.get('http://localhost:5000/api/departments') // Assuming you have a department endpoint
      ]);
      setCourts(courtRes.data);
      setLocations(locationRes.data);
      setJudges(judgeRes.data);
      setSubjects(subjectRes.data);
      setStatuses(statusesRes.data);
      setBenches(benchesRes.data);
      setDepartment(departmentRes.data);
    } catch (error) {
      console.error("Dropdown fetch failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/cases', formData);
      alert("Case submitted successfully!");
      onCancel(); // to close the form
    } catch (error) {
      console.error('Submit failed:', error);
      alert("Failed to submit case.");
    }
  };

  return (
    <div className="case-form-container">
      <form className="case-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Case Details</legend>

          <div className="form-row">
            <input type="text" placeholder="Case No *" name="caseNo" value={formData.caseNo} onChange={handleChange} required />
            <select name="caseType" value={formData.caseType} onChange={handleChange} required>
              <option value="">Case type *</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            <input type="text" placeholder="Case Title *" name="caseTitle" value={formData.caseTitle} onChange={handleChange} required />
          </div>

          <div className="form-row">
                <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Ministry/Division/Department*</option>
            {department.map(dep => (
                <option key={dep._id} value={dep._id}>{dep.name}</option>
            ))} 
            </select>
          
          </div>

          <div className="form-row">
            <input type="text" placeholder="File No" name="fileNo" value={formData.fileNo} onChange={handleChange} />
            <input type="text" placeholder="Revenue (In Million)" name="revenue" value={formData.revenue} onChange={handleChange} />
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="">Status *</option>
              {statuses.map(status => (
    <option key={status._id} value={status._id}>{status.name}</option>
  ))}
            </select>
          </div>

          <div className="form-row">
            <select name="court" value={formData.court} onChange={handleChange} required>
              <option value="">Select Court</option>
              {courts.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select name="location" value={formData.location} onChange={handleChange} required>
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.name}</option>
              ))}
            </select>

            <select name="bench" value={formData.bench} onChange={handleChange}>
              <option>Select Bench</option>
              {benches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <select name="judges" value={formData.judges} onChange={handleChange} required>
              <option value="">Select Judge</option>
              {judges.map(j => (
                <option key={j._id} value={j._id}>{j.name}</option>
              ))}
            </select>

            <select name="subjectMatter" value={formData.subjectMatter} onChange={handleChange} required>
              <option value="">Select Subject Matter</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

            <input type="text" name="totalJudges" placeholder="Total Judges" value={formData.totalJudges} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <textarea placeholder="Initial Remarks *" rows="3" name="remarks" value={formData.remarks} onChange={handleChange} required></textarea>
          </div>

          <div className="form-row">
  <div className="form-group">
    <label htmlFor="hearingDate">Hearing Date</label>
    <input type="date" id="hearingDate" name="hearingDate" value={formData.hearingDate} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label htmlFor="nextHearingDate">Next Hearing Date</label>
    <input type="date" id="nextHearingDate" name="nextHearingDate" value={formData.nextHearingDate} onChange={handleChange} />
  </div>

  <div className="form-group">
    <label htmlFor="caseFile">Upload File</label>
    <input type="file" id="caseFile" />
  </div>
</div>



        </fieldset>

        <fieldset>
          <legend>Department's Focal Person & Advocate Details</legend>
          <div className="form-row">
            <input type="text" name="focalPerson" placeholder="Focal Person Name" value={formData.focalPerson} onChange={handleChange} />
            <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} />
            <input type="text" name="advocate" placeholder="Advocate/Law Officer (if any)" value={formData.advocate} onChange={handleChange} />
          </div>
        </fieldset>

        <div className="form-row form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
