import React from "react";

const FileDisplay = ({ files, caseRemarks }) => {
  const downloadFile = (filename) => {
    const url = `http://localhost:5000/api/cases/download/${filename}`;
    window.open(url, "_blank");
  };

  return (
    <div className="file-display">
      {/* Main case files */}
      {files && files.length > 0 && (
        <div className="file-section">
          <h5>Case Files:</h5>
          {files.map((filename, index) => (
            <div key={index} className="file-item">
              <button
                type="button"
                onClick={() => downloadFile(filename)}
                className="file-download-btn"
              >
                📎 {filename}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Case remark files */}
      {caseRemarks && caseRemarks.some((remark) => remark.file) && (
        <div className="file-section">
          <h5>Remark Files:</h5>
          {caseRemarks.map(
            (remark, index) =>
              remark.file && (
                <div key={index} className="file-item">
                  <span className="remark-date">{remark.date}</span>
                  <button
                    type="button"
                    onClick={() => downloadFile(remark.file)}
                    className="file-download-btn"
                  >
                    📎 {remark.file}
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
