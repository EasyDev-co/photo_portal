import styles from "./ButtonBurger.module.css";

export const ButtonBurger = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.burger} type="button">
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </button>
  );
};
