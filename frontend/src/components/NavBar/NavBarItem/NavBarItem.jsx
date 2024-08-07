import { useDispatch } from "react-redux";
import styles from "./NavBarItem.module.css";
import { Link } from "react-router-dom";
import { removeUser } from "../../../store/authSlice";

export const NavBarItem = ({ style, router, icon, alt, text, onClick,isLogOut }) => {
  const dispatch = useDispatch();
  
  return (
    <li onClick={()=> isLogOut && dispatch(removeUser())} className={`${style ? style : ""}`}>
      <Link className={styles.link} to={router} onClick={onClick}>
        <img src={icon} alt={alt} />
        <p className={styles.text}>{text}</p>
      </Link>
    </li>
  );
};
