// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { FileUpload } from './components/FileUpload';
import { SummaryResult } from './components/SummaryResult';
import { Navbar } from './components/Navbar';
import { SummaryControls } from './components/SummaryControls';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [summaryParams, setSummaryParams] = useState({
    ratio: 0.3,
    min: 3,
    max: 10
  });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setSummary('');
    setError('');
    setDownloadInfo(null);
    toast.info(`File "${selectedFile.name}" selected!`);
  };

  const handleParamChange = (name, value) => {
    setSummaryParams({
      ...summaryParams,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a text file');
      toast.error('Please select a text file');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ratio', summaryParams.ratio);
    formData.append('min', summaryParams.min);
    formData.append('max', summaryParams.max);

    try {
      const response = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
        setDownloadInfo({
          filePath: data.file_path,
          downloadName: data.download_name
        });
        toast.success('Summary generated successfully!');
      } else {
        setError(data.error || 'An error occurred during summarization');
        toast.error(data.error || 'An error occurred during summarization');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      toast.error('Failed to connect to the server. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadInfo) {
      window.open(
        `http://localhost:5000/api/download/${encodeURIComponent(downloadInfo.filePath)}/${encodeURIComponent(downloadInfo.downloadName)}`,
        '_blank'
      );
      toast.info('Downloading summary...');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`shadow-lg rounded-lg p-6 max-w-4xl mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}
          >
            BERTSUM Extractive Text Summarizer
          </motion.h1>
          
          <FileUpload 
            onFileChange={handleFileChange} 
            selectedFile={file}
            darkMode={darkMode}
          />
          
          <SummaryControls 
            params={summaryParams}
            onParamChange={handleParamChange}
            onSubmit={handleSubmit}
            disabled={!file || loading}
            darkMode={darkMode}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 bg-red-100 text-red-700 rounded-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mt-6"
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SummaryResult 
                  summary={summary}
                  onDownload={handleDownload}
                  darkMode={darkMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" theme={darkMode ? "dark" : "light"} />
    </div>
  );
}

export default App;