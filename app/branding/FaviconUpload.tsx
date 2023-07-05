'use client'

import React, { useState } from 'react';


interface Props {
  fav?: any
}

const FaviconUpload: React.FC = ({fav}:Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file:any = e.target.files?.[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      fav(selectedFile);
    }
  };

  return (
    <div className='mt-10'>
      <label htmlFor="favicon" className="block mb-2 text-black dark:text-white">
        Favicon
      </label>
      <input
        type="file"
        id="favicon"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
          onClick={() => document.getElementById('favicon')?.click()}
        >
          Select Favicon
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

export default FaviconUpload;
