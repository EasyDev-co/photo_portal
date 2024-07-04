import styles from "./RulesItem.module.css";

export const RulesItem = ({ text }) => {
  return (
    <li className={styles.item}>
      <div className={styles.numBlock}>
        <p className={styles.itemNum}>{text.num}</p>
      </div>
      <p className={styles.itemText}>{text.text}</p>
    </li>
  );
};
