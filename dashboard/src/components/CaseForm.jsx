import React from 'react';
import './CaseForm.css';

const CaseForm = ({ onCancel }) => {
  return (
    <div className="case-form-container">
      <form className="case-form">
        {/* CASE DETAILS SECTION */}
        <fieldset>
          <legend>Case Details</legend>

          <div className="form-row">
            <input type="text" placeholder="Case No *" required />
            <select required>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            <input type="text" placeholder="Case Title *" required />
          </div>

          <div className="form-row">
            <input type="text" placeholder="Ministry/Division/Department *" required />
          </div>

          <div className="form-row">
            <input type="text" placeholder="File No" />
            <input type="text" placeholder="Revenue (In Million)" />
            <select required>
              <option>Status *</option>
              <option>Pending</option>
              <option>Closed</option>
              <option>In Progress</option>
            </select>
          </div>

          <div className="form-row">
<select required>
  <option value="">Select Court</option>
  <option value="Supreme Court of Pakistan">Supreme Court of Pakistan</option>
  <option value="Islamabad High Court">Islamabad High Court</option>
  <option value="Peshawar High Court">Peshawar High Court</option>
  <option value="Lahore High Court">Lahore High Court</option>
  <option value="Sindh High Court">Sindh High Court</option>
  <option value="Pakistan Information Commission">Pakistan Information Commission</option>
  <option value="Federal Service Tribunal">Federal Service Tribunal</option>
  <option value="CIVIL Courts">CIVIL Courts</option>
  <option value="District Court(South)">District Court(South)</option>
</select>

<select required>
  <option value="">Select Location</option>
  <option value="Karachi">Karachi</option>
  <option value="Lahore">Lahore</option>
  <option value="Islamabad">Islamabad</option>
  <option value="Rawalpindi">Rawalpindi</option>
  <option value="Peshawar">Peshawar</option>
  <option value="Quetta">Quetta</option>
  <option value="Sialkot">Sialkot</option>
  <option value="Sukkur">Sukkur</option>
  <option value="Hyderabad">Hyderabad</option>
  <option value="Faisalabad">Faisalabad</option>
  <option value="Multan">Multan</option>
</select>
            <select><option>Select Bench</option></select>
          </div>

         <div className="form-row">
  <div className="form-group">
    <label htmlFor="selectJudges">Select Judges</label>
    <input type="text" id="selectJudges" placeholder="Select Judges" required />
  </div>

  <div className="form-group">
    <label htmlFor="subjectMatter">Subject Matter</label>
    <select id="subjectMatter" required>
      <option value="">Select Subject Matter</option>
      <option value="Cases related to MNAs">Cases related to MNAs</option>
      <option value="Cases related to Service matters">Cases related to Service matters</option>
      <option value="Cases related to Special Committee on Affected Employees">
        Cases related to Special Committee on Affected Employees
      </option>
      <option value="Cases related to the Public Accounts Committee">
        Cases related to the Public Accounts Committee
      </option>
      <option value="Cases related to other Committees">Cases related to other Committees</option>
      <option value="Appeals/Petitions related to the Right of Access to Information Act, 2017">
        Appeals/Petitions related to the Right of Access to Information Act, 2017
      </option>
      <option value="Cases of Miscellaneous nature">Cases of Miscellaneous nature</option>
      <option value="Cases in which either details are awaited or are on the Notice stage">
        Cases in which either details are awaited or are on the Notice stage
      </option>
    </select>
  </div>

  <div className="form-group">
    <label htmlFor="totalJudges">Total Judges</label>
    <input type="text" id="totalJudges" placeholder="Total Judges" required />
  </div>
</div>


          <div className="form-row">
            <textarea placeholder="Initial Remarks *" rows="3" required></textarea>
          </div>

         <div className="form-row">
  <div className="form-group">
    <label>Hearing Date</label>
    <input type="date" />
  </div>

  <div className="form-group">
    <label>Next Hearing Date</label>
    <input type="date" />
  </div>

  <div className="form-group">
    <label>Upload File</label>
    <input type="file" />
  </div>
</div>

        </fieldset>

        {/* FOCAL PERSON SECTION */}
        <fieldset>
          <legend>Department's Focal Person & Advocate Details</legend>
          <div className="form-row">
            <input type="text" placeholder="Focal Person Name" />
            <input type="text" placeholder="Contact" />
            <input type="text" placeholder="Advocate/Law Officer (if any)" />
          </div>
        </fieldset>

        {/* BUTTONS */}
        <div className="form-row form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CaseForm;
