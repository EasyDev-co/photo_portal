import styles from "./SocialItem.module.css";

export const SocialItem = ({ href, icon, alt }) => {
  return (
    <li className={styles.socialItem}>
      <a className={styles.link} href={href} target="blank">
        <img className={styles.icon} src={icon} alt={alt} />
      </a>
    </li>
  );
};
