'use client'

import React, { useState } from 'react';

const LogoUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file:any = e.target.files?.[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    // Implement the file upload logic here
    if (selectedFile) {
      // Perform upload action using the selectedFile
      console.log('Uploading logo:', selectedFile);
    }
  };

  return (
    <div>
      <label htmlFor="logo" className="block mb-2 text-black dark:text-white">
        Logo
      </label>
      <input
        type="file"
        id="logo"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
          onClick={() => document.getElementById('logo')?.click()}
        >
          Select Logo
        </button>
        <span>{selectedFile?.name}</span>
        <button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default LogoUpload;
