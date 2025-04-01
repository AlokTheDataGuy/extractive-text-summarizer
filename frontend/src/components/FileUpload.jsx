// components/FileUpload.jsx
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export const FileUpload = ({ onFileChange, selectedFile, darkMode }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/plain') {
      onFileChange(file);
    } else if (file) {
      alert('Please upload a .txt file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/plain') {
        onFileChange(file);
      } else {
        alert('Please upload a .txt file');
      }
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Upload Text File (.txt)
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
          darkMode ? 'border-gray-600 hover:border-blue-500 bg-gray-700' : 'border-gray-300 hover:border-blue-500 bg-gray-50'
        }`}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
          id="file-upload"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <p className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{selectedFile.name}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {(selectedFile.size / 1024).toFixed(2)} KB - Click to change
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Drag and drop your text file here
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              or click to browse files
            </p>
            <button
              className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Select File
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};