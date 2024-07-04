import styles from "./AboutUs.module.css";
import { Title } from "../Title/Title";
import { AboutUsItem } from "./AboutUsItem/AboutUsItem";
import { aboutUsItems } from "../../constants/constants";
export const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <Title text="О нас" />
      <ul className={styles.list}>
        {aboutUsItems.map((item, index) => {
          return <AboutUsItem info={item} key={index} />;
        })}
      </ul>
    </div>
  );
};
