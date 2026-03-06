import styles from "./Pagination.module.css";
import PaginationItem from "./PaginationItem";

export default function Pagination({ pages, currentPage, onPageChange }) {
  if (!pages || pages <= 0) return null;

  const getPages = () => {
    const visiblePages = [];

    // Always show first page
    visiblePages.push(1);

    // Show left ellipsis
    if (currentPage > 3) {
      visiblePages.push("left-ellipsis");
    }

    // Show current page if not first or last
    if (currentPage !== 1 && currentPage !== pages) {
      visiblePages.push(currentPage);
    }

    // Show right ellipsis
    if (currentPage < pages - 2) {
      visiblePages.push("right-ellipsis");
    }

    // Always show last page
    if (pages > 1) {
      visiblePages.push(pages);
    }

    return visiblePages;
  };

  const pageList = getPages();

  return (
    <div className={styles.pagination}>
      {/* PREVIOUS */}
      <PaginationItem
        variant="inactive"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </PaginationItem>

      {pageList.map((page, _) => {
        if (typeof page === "string") {
          return <PaginationItem key={page}>...</PaginationItem>;
        }

        return (
          <PaginationItem
            key={page}
            variant={page === currentPage ? "active" : "inactive"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationItem>
        );
      })}

      {/* NEXT */}
      <PaginationItem
        variant="inactive"
        disabled={currentPage === pages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </PaginationItem>
    </div>
  );
}
