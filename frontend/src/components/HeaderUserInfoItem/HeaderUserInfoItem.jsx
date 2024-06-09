import "./HeaderUserInfoItem.css";

export const HeaderUserInfoItem = ({ styles, top, bottom }) => {
  return (
    <li className={`header-user-info-item${styles ? styles : ""}`}>
      <p className="header-user-info-item__text">{top}</p>
      <p className="header-user-info-item__text">{bottom}</p>
    </li>
  );
};
