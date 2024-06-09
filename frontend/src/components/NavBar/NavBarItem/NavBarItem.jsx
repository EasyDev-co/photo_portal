import "./NavBarItem.css";
import { Link } from "react-router-dom";

export const NavBarItem = ({ styles, router, icon, alt, text }) => {
  return (
    <li className={`nav-bar-item${styles ? styles : ""}`}>
      <Link className="nav-bar-item__link" to={router}>
        <img src={icon} alt={alt} />
        <p className="nav-bar-item__text">{text}</p>
      </Link>
    </li>
  );
};
