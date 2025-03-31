'use client';

import React, { useState } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

export const DoctorDocumentUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please upload an image (JPEG, PNG, GIF) or a PDF file.');
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a valid file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('document', file);
    if (description) {
      formData.append('description', description);
    }

    try {
      const { data } = await apiClient.post('/auth/upload_document/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Document uploaded:', data);
      onUpload();
      setFile(null);
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <label className="text-[#3d5a80] text-sm font-normal font-['Inter']">
        Upload Document (Images or PDFs only)
      </label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,application/pdf"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-normal font-['Inter']"
      />
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Optional description (e.g., Medical License)"
        disabled={uploading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-normal font-['Inter']"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-fit px-4 py-2 rounded-md text-white font-normal font-['Inter'] ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4285f4] hover:bg-[#3267d6]'}`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};