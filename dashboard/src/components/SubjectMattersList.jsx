// ✅ SubjectMattersList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddSubjectModal from "./AddSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import SearchBar from "./SearchBar"; // ✅ Importing reusable search bar

const SubjectMattersList = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]); // ✅ State to store filtered list
  const [searchTerm, setSearchTerm] = useState(""); // ✅ State to store search term
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSubject, setEditSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subject-matter");
      setSubjects(res.data);
      setFilteredSubjects(res.data); // ✅ Initialize filtered list
    } catch (err) {
      console.error("Error fetching subject matters:", err);
    }
  };

  const handleAddSubject = async (newSubject) => {
    try {
      await axios.post("http://localhost:5000/api/subject-matter", newSubject);
      fetchSubjects();
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding subject matter:", err);
    }
  };

  const handleUpdateSubject = async (updatedSubject) => {
    try {
      await axios.put(
        `http://localhost:5000/api/subject-matter/${updatedSubject._id}`,
        updatedSubject
      );
      fetchSubjects();
      setEditSubject(null);
    } catch (err) {
      console.error("Error updating subject matter:", err);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subject-matter/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject matter:", err);
    }
  };

  // ✅ Filter logic
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  return (
    <div className="courts-list">
      <div className="courts-header">
        <h2>Subject Matters</h2>
        {/* ✅ Reusable Search Bar Component */}
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          placeholder="Search subject matter..."
        />
        <button onClick={() => setShowAddModal(true)} className="btn-add">
          Add Subject
        </button>
      </div>

      <div className="courts-table">
        <div className="courts-table-header">
          <span>S.No</span>
          <span>Subject Matter</span>
          <span>Actions</span>
        </div>
        {filteredSubjects.length === 0 ? (
          <div
            className="courts-table-row"
            style={{ textAlign: "center", color: "#888" }}
          >
            <span colSpan={3}>No subject matters found.</span>
          </div>
        ) : (
          filteredSubjects.map((subject, index) => (
            <div className="courts-table-row" key={subject._id}>
              <span>{index + 1}</span>
              <span>{subject.name}</span>
              <span>
                <button
                  className="btn-edit"
                  onClick={() => setEditSubject(subject)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteSubject(subject._id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddSubjectModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubject}
        />
      )}

      {editSubject && (
        <EditSubjectModal
          subject={editSubject}
          onClose={() => setEditSubject(null)}
          onUpdate={handleUpdateSubject}
        />
      )}
    </div>
  );
};

export default SubjectMattersList;
