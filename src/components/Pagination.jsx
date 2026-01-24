import styles from "./Pagination.module.css";
import PaginationItem from "./PaginationItem";

export default function Pagination() {
  return (
    <div className={styles.pagination}>
      <PaginationItem variant="inactive">«</PaginationItem>
      <PaginationItem variant="active">1</PaginationItem>
      <PaginationItem variant="inactive">2</PaginationItem>
      <PaginationItem variant="inactive">3</PaginationItem>
      <PaginationItem variant="inactive">4</PaginationItem>
      <PaginationItem variant="inactive">5</PaginationItem>
      <PaginationItem variant="inactive">»</PaginationItem>
    </div>
  );
}
