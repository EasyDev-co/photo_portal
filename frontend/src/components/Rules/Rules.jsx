import styles from "./Rules.module.css";
import { RulesItem } from "./RulesItem/RulesItem";
import { Title } from "../Title/Title";
import { rulesItems } from "../../constants/constants";

export const Rules = () => {
  return (
    <div className={styles.rules}>
      <Title text="Правила" />
      <ul className={styles.list}>
        {rulesItems.map((item, index) => {
          return <RulesItem text={item} key={index} />;
        })}
      </ul>
    </div>
  );
};
