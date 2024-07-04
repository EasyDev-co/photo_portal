import styles from "./AboutUsItem.module.css";

export const AboutUsItem = ({ info }) => {
  return (
    <li className={styles.aboutUsItem}>
      <img className={styles.img} src={info.photo} alt={info.infoAltPhoto} />
      <div className={styles.textBlock}>
        <span className={styles.line} />
        <p className={styles.text}>{info.text}</p>
        <img className={styles.icon} src={info.icon} alt={info.iconAlt} />
      </div>
    </li>
  );
};
