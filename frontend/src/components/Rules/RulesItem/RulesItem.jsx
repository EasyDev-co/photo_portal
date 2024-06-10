import "./RulesItem.css";

export const RulesItem = ({ text }) => {
  return (
    <li className="rules-item__item">
      <div className="rules-item__num-block">
        <p className="rules-item__num">{text.num}</p>
      </div>
      <p className="rules-item__text">{text.text}</p>
    </li>
  );
};
