import React from 'react';
import { Button } from './Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toPersianDigits } from '@/lib/formatters';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems ?? currentPage * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {totalItems !== undefined && (
        <p className="text-xs text-muted-foreground">
          نمایش {toPersianDigits(startItem)} تا {toPersianDigits(endItem)} از مجموع{' '}
          {toPersianDigits(totalItems)} مورد
        </p>
      )}

      <div className="flex items-center gap-1.5 mr-auto sm:mr-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-2.5"
          title="صفحه قبل"
        >
          <ChevronRight className="w-4 h-4 ml-1" />
          <span>قبلی</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Only show reasonable window of pages
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {toPersianDigits(page)}
                </button>
              );
            }
            if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="text-xs text-muted-foreground px-1">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-2.5"
          title="صفحه بعد"
        >
          <span>بعدی</span>
          <ChevronLeft className="w-4 h-4 mr-1" />
        </Button>
      </div>
    </div>
  );
};
