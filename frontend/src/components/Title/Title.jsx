import styles from "./Title.module.css";

export const Title = ({ text }) => {
  return <h1 className={styles.title}>{text}</h1>;
};
