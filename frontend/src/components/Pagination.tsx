import React from "react";
import { DOTS, usePagination } from "../hooks/usePagination";
import "./Pagination.scss";

type PaginationProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize = 10,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    if (currentPage <= paginationRange.length - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="pagination-container">
      <li className="pagination-item" onClick={onPrevious}>
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li
            className="pagination-item"
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}

      <li className="pagination-item" onClick={onNext}>
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default Pagination;
