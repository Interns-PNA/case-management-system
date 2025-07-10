import React, { useEffect, useState } from "react";
import axios from "axios";

const EditBenchesModal = ({ bench, onClose, onUpdate }) => {
  const [name, setName] = useState(bench.name || "");
  const [courts, setCourts] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState(
    bench.courts?.map((court) =>
      typeof court === "object" ? court._id : court
    ) || []
  );

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courts");
      setCourts(res.data);
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  const handleCheckboxChange = (courtId) => {
    setSelectedCourts((prev) =>
      prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId]
    );
  };

  const handleSubmit = () => {
    if (!name || selectedCourts.length === 0) {
      alert("Bench name and at least one court are required.");
      return;
    }

    const updatedBench = {
      ...bench,
      name,
      courts: selectedCourts,
    };

    onUpdate(updatedBench);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fadeIn">
        <h3 className="text-xl font-semibold mb-6 text-center text-blue-700">
          Edit Bench
        </h3>
        <input
          type="text"
          placeholder="Bench Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="mb-6">
          <strong className="block mb-2 text-gray-700">Select Courts:</strong>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {courts.map((court) => (
              <label key={court._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={court._id}
                  checked={selectedCourts.includes(court._id)}
                  onChange={() => handleCheckboxChange(court._id)}
                  className="accent-blue-600"
                />
                <span>{court.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium transition"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBenchesModal;
