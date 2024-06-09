import "./SocialItem.css";

export const SocialItem = ({ href, icon, alt }) => {
  return (
    <li className="social-item">
    <a className="social-item-link" href={href}>
      <img
        className="social-item-icon"
        src={icon}
        alt={alt}
      />
    </a>
  </li>
  );
}
