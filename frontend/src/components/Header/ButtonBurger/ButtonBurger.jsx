import "./ButtonBurger.css";

export const ButtonBurger = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="burger"
      type="button"
    >
      <span className="burger-line"></span>
      <span className="burger-line"></span>
      <span className="burger-line"></span>
    </button>
  );
};
