import "./Rules.css";
import { RulesItem } from "./RulesItem/RulesItem";
import { Title } from "../Title/Title";
import { rulesItems } from "../../constants/constants";

export const Rules = () => {
  return (
    <div className="riles">
      <Title text="Правила" />
      <ul className="rules__list">
        {rulesItems.map((item, index) => {
          return <RulesItem text={item} key={index} />;
        })}
      </ul>
    </div>
  );
};
