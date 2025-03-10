import clsx from "clsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import style from "./pagination.module.scss";

import { usePagination } from "../../../hooks/usePagination";

type PaginationProps = {
  className?: string;
  currentPage: number;
  disabled?: boolean;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  onPageChange: (page: number) => void;
  totalPages?: number;
};

export const Pagination = (props: PaginationProps) => {
  const {
    className,
    currentPage,
    disabled,
    onPageChange,
    totalPages = 1,
  } = props;

  const pages = usePagination(currentPage, totalPages);

  const handlePageClick = (page: "..." | number) => {
    if (page !== currentPage && page !== "...") {
      onPageChange(page);
    }
  };

  return (
    <div aria-disabled={disabled} className={clsx(style.pagination, className)}>
      <div className={style.buttons}>
        <button
          className={clsx(
            style.button,
            currentPage === 1 && style.arrowDisabled
          )}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          type={"button"}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        {pages.map((page, index) => (
          <button
            className={clsx(style.button, page === currentPage && style.active)}
            disabled={page === "..."}
            key={index}
            onClick={() => handlePageClick(Number(page))}
            type={"button"}
          >
            {page}
          </button>
        ))}

        <button
          className={clsx(
            style.button,
            (currentPage === totalPages || totalPages === 0) &&
              style.arrowDisabled
          )}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          type={"button"}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};
