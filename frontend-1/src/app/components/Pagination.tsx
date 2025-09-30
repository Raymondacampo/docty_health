import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="self-stretch py-4 justify-center items-center gap-4 inline-flex">
      {/* Previous Button - Only show if there's a previous page */}
      {currentPage > 1 && (
        <div data-svg-wrapper onClick={handlePrevious} className="cursor-pointer">
          <svg width="12" height="22" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 1L1.5 12L12.5 23" stroke="#EE6C4D" strokeWidth="2"/>
          </svg>
        </div>
      )}
      
      {/* Page Indicator */}
      <div className="h-[18px] text-[#ee6c4d] text-xs font-normal">
        Page {currentPage} of {totalPages}
      </div>
      
      {/* Next Button - Only show if there's a next page */}
      {currentPage < totalPages && (
        <div data-svg-wrapper onClick={handleNext} className="cursor-pointer">
          <svg width="12" height="22" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L12.5 12L1.5 23" stroke="#EE6C4D" strokeWidth="2"/>
          </svg>
        </div>
      )}
    </div>
  );
}