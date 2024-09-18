import styles from "./HeaderUserInfoItem.module.css";

export const HeaderUserInfoItem = ({ style, top, bottom, isKindergarten }) => {
  return (
    <li className={`${style ? style : ""}`}>
      <p className={styles.text}>{top}</p>
      <p className={styles.text}>{isKindergarten ? `Детский сад "${bottom}"` : bottom}</p>
    </li>
  );
};
