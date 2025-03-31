'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/utils/api'; // Import apiClient

const ThreeDotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="8" r="1.5" fill="black" />
    <circle cx="8" cy="8" r="1.5" fill="black" />
    <circle cx="13" cy="8" r="1.5" fill="black" />
  </svg>
);

const DocumentsSection = ({ data, onReload }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const menuRefs = useRef({});
  const backendUrl = 'https://juanpabloduarte.com'; // Adjust as needed

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

  const closeDocument = () => {
    setSelectedDocument(null);
  };

  const handleDelete = async (docId) => {
    try {
      await apiClient.delete(`/auth/delete_document/${docId}/`);
      onReload();
      setShowMenu(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu) {
        const isOutside = Object.values(menuRefs.current).every(
          (ref) => ref && !ref.contains(event.target)
        );
        if (isOutside) {
          setShowMenu(null);
        }
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="w-full rounded-[10px] flex-col justify-start items-start gap-2 inline-flex">
      <div className="self-stretch text-black font-normal font-['Inter'] sm:text-xl xs:text-lg">
        Documents
      </div>
      <div className="self-stretch p-4 rounded-[10px] flex-col justify-start items-start gap-4 flex">
        <div className="self-stretch flex-col justify-start items-start gap-2 flex">
          {data.documents && data.documents.length > 0 ? (
            data.documents.map((doc) => (
              <div
                key={doc.id}
                className="w-full px-4 py-1 bg-[#98c1d1]/25 rounded-[10px] flex justify-between items-center"
              >
                <button
                  onClick={() => handleDocumentClick(doc)}
                  className="text-black text-sm font-normal font-['Inter'] hover:underline"
                >
                  {doc.description || 'Unnamed Document'}
                </button>
                <div ref={(el) => (menuRefs.current[doc.id] = el)} className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === doc.id ? null : doc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Document options"
                  >
                    <ThreeDotsIcon />
                  </button>
                  {showMenu === doc.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-black text-sm font-normal font-['Inter']">
              No documents uploaded
            </div>
          )}
        </div>
      </div>
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg px-8 py-6 max-w-[95%] max-h-[95dvh] overflow-auto">
            <button
              onClick={closeDocument}
              className="absolute top-2 right-2 text-black text-lg font-bold"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h3 className="text-black text-2xl font-normal font-['Inter'] mb-4">
              {selectedDocument.description || 'Unnamed Document'}
            </h3>
            {selectedDocument.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={`${backendUrl}${selectedDocument.url}`}
                alt={selectedDocument.description || 'Document'}
                className="max-w-full max-h-full object-contain"
              />
            ) : selectedDocument.url.endsWith('.pdf') ? (
              <div>
                <p className="text-black text-lg font-['Inter'] mb-2">PDF Preview:</p>
                <a
                  href={`${backendUrl}${selectedDocument.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : (
              <p className="text-sm font-['Inter']">
                Unsupported file type.{' '}
                <a
                  href={`${backendUrl}${selectedDocument.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download file
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;