import styles from "./HeaderUserInfoItem.module.css";

export const HeaderUserInfoItem = ({ style, top, bottom }) => {
  return (
    <li className={`${style ? style : ""}`}>
      <p className={styles.text}>{top}</p>
      <p className={styles.text}>{bottom}</p>
    </li>
  );
};
