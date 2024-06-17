import styles from "./NavBarItem.module.css";
import { Link } from "react-router-dom";

export const NavBarItem = ({ style, router, icon, alt, text, onClick }) => {
  return (
    <li className={`${style ? style : ""}`}>
      <Link className={styles.link} to={router} onClick={onClick}>
        <img src={icon} alt={alt} />
        <p className={styles.text}>{text}</p>
      </Link>
    </li>
  );
};
