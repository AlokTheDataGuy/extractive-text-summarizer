// components/SummaryControls.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const SummaryControls = ({ params, onParamChange, onSubmit, disabled, darkMode }) => {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Summarization Settings
      </h2>
      
      <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Summary Ratio: {(params.ratio * 100).toFixed(0)}%
            </label>
            <div className="flex items-center">
              <span className={`text-sm mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>10%</span>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={params.ratio}
                onChange={(e) => onParamChange('ratio', parseFloat(e.target.value))}
                className={`w-full ${darkMode ? 'accent-blue-500' : 'accent-blue-600'}`}
              />
              <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>90%</span>
            </div>
            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Percentage of original text to keep
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Minimum Sentences
            </label>
            <div className="flex">
              <button 
                className={`px-3 py-2 rounded-l-md border ${
                  darkMode 
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
                onClick={() => onParamChange('min', Math.max(1, params.min - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="20"
                value={params.min}
                onChange={(e) => onParamChange('min', parseInt(e.target.value))}
                className={`shadow appearance-none border text-center w-full py-2 px-3 leading-tight focus:outline-none focus:ring ${
                  darkMode 
                    ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300 focus:ring-blue-300'
                }`}
              />
              <button 
                className={`px-3 py-2 rounded-r-md border ${
                  darkMode 
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
                onClick={() => onParamChange('min', Math.min(20, params.min + 1))}
              >
                +
              </button>
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Maximum Sentences
            </label>
            <div className="flex">
              <button 
                className={`px-3 py-2 rounded-l-md border ${
                  darkMode 
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
                onClick={() => onParamChange('max', Math.max(params.min, params.max - 1))}
              >
                -
              </button>
              <input
                type="number"
                min={params.min}
                max="50"
                value={params.max}
                onChange={(e) => onParamChange('max', parseInt(e.target.value))}
                className={`shadow appearance-none border text-center w-full py-2 px-3 leading-tight focus:outline-none focus:ring ${
                  darkMode 
                    ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300 focus:ring-blue-300'
                }`}
              />
              <button 
                className={`px-3 py-2 rounded-r-md border ${
                  darkMode 
                    ? 'bg-gray-600 text-white border-gray-500 hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
                onClick={() => onParamChange('max', Math.min(50, params.max + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          disabled={disabled}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            disabled 
              ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600' 
              : darkMode 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Generate Summary
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
