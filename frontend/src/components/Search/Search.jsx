import "./Search.css";
import { searchIcon } from "../../constants/constants";

export const Search = ({ styles }) => {
  return (
    <>
      <div className={`search__block${styles ? styles : ""}`}>
        <label className="search__icon-label" htmlFor="search-input">
          <img className="search__icon" src={searchIcon} alt="иконка лупы" />
        </label>
        <input
          className="search__input"
          type="text"
          placeholder="Поиск"
          id="search-input"
        />
      </div>
    </>
  );
};
