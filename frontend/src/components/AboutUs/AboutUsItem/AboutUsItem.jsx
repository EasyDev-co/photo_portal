import "./AboutUsItem.css";

export const AboutUsItem = ({ info }) => {
  return (
    <li className="about-us-item">
      <img
        className="about-us-item__img"
        src={info.photo}
        alt={info.infoAltPhoto}
      />
      <div className="about-us-item__text-block">
        <span className="about-us-item__line" />
        <p className="about-us-item__text">{info.text}</p>
        <img
          className="about-us-item__icon"
          src={info.icon}
          alt={info.iconAlt}
        />
      </div>
    </li>
  );
};
