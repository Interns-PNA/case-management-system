import React, { useState } from "react";

const AddSubjectModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return alert("Name is required");
    onSubmit({ name });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fadeIn">
        <h3 className="text-xl font-semibold mb-6 text-center text-blue-700">
          Add Subject Matter
        </h3>
        <input
          type="text"
          placeholder="Subject Matter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end gap-3">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded font-medium transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectModal;
