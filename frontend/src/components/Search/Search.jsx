import styles from "./Search.module.css";
import { searchIcon } from "../../constants/constants";

export const Search = ({ style }) => {
  return (
    <>
      <div className={`${styles.block} ${style ? style : ""}`}>
        <label className={styles.label} htmlFor="search-input">
          <img className={styles.icon} src={searchIcon} alt="иконка лупы" />
        </label>
        <input
          className={styles.input}
          type="text"
          placeholder="Поиск"
          id="search-input"
        />
      </div>
    </>
  );
};
