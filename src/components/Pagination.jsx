import styles from "./Pagination.module.css";
import PaginationItem from "./PaginationItem";

export default function Pagination({ pages }) {
  return (
    <div className={styles.pagination}>
      <PaginationItem variant="inactive">«</PaginationItem>
      {pages === 0 ? (
        <PaginationItem variant={"active"}>1</PaginationItem>
      ) : (
        Array.from({ length: pages }).map((_, index) => (
          <PaginationItem key={index}>index</PaginationItem>
        ))
      )}
      <PaginationItem variant="inactive">»</PaginationItem>
    </div>
  );
}
