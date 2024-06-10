import "./AboutUs.css";
import { Title } from "../Title/Title";
import { AboutUsItem } from "./AboutUsItem/AboutUsItem";
import { aboutUsItems } from "../../constants/constants";
export const AboutUs = () => {
  return (
    <div className="about-us">
      <Title text="О нас" />
      <ul className="about-us__list">
        {aboutUsItems.map((item, index) => {
          return <AboutUsItem info={item} key={index} />;
        })}
      </ul>
    </div>
  );
};
