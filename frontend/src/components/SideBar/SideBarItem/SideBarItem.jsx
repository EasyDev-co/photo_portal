/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useDispatch } from "react-redux";
import styles from "./SideBarItem.module.css";
import { Link, useLocation } from "react-router-dom";
import { removeUser } from "../../../store/authSlice";

export const SideBarItem = ({
  sty,
  router,
  pathFill,
  svgWidth,
  svgHeight,
  svgViewBox,
  svgFill,
  svgXmlns,
  svgD,
  svgStroke,
  svgStrokeWidth,
  svgStrokeLinecap,
  secondPathD,
  isLogOut
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = location.pathname === router; // проверяем, соответствует ли текущий путь маршруту элемента

  return (
    <li
      onClick={()=> isLogOut && dispatch(removeUser())}
      className={`${styles.navItem} ${sty ? sty : ""} ${
        isActive ? styles.active : ""
      }`}
    >
      <Link className={styles.navLink} to={router}>
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={svgViewBox}
          fill={svgFill}
          xmlns={svgXmlns}
        >
          <path
            d={svgD}
            stroke={isActive && svgStroke !== "" ? "#11bbd1" : svgStroke}
            strokeWidth={svgStrokeWidth}
            strokeLinecap={svgStrokeLinecap}
            fill={isActive && pathFill !== "" ? "#11bbd1" : pathFill}
          />
          {secondPathD !== "" ? (
            <path
              d={secondPathD}
              fill={isActive && pathFill !== "" ? "#11bbd1" : pathFill}
            />
          ) : null}
        </svg>
      </Link>
    </li>
  );
};
