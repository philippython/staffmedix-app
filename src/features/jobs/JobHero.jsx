import Button from "../../components/Button";
import styles from "./JobHero.module.css";
import CustomSelect from "../../components/CustomSelect";
import Input from "../../components/Input";

export default function JobHero() {
  return (
    <header className={styles.jobHero}>
      <h3>Find Your Next Healthcare Opportunity</h3>
      <div>
        <Input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input type="text" placeholder="Search by job title, profession..." />
        </Input>
        <CustomSelect />
        <Button variant={"coloredButton"}>
          <div className={styles.searchButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-search absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <p>Search Jobs</p>
          </div>
        </Button>
      </div>
    </header>
  );
}
