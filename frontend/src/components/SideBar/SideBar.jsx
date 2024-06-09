import "./SideBar.css";
import { vkIcon, whatsAppIcon, telegramIcon } from "../../constants/constants";
import { SocialItem } from "../SocialItem/SocialItem";
import { SideBarItem } from "./SideBarItem/SideBarItem";

export const SideBar = () => {
  return (
    <div className="side-bar">
      <div className="side-bar__first-block">
        <nav className="side-bar__nav">
          <ul className="side-bar__nav-list">
            <SideBarItem
              router="/"
              svgWidth="25"
              svgHeight="24"
              svgViewBox="0 0 25 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M17.5003 6C17.5003 3.23858 15.2617 1 12.5003 1C9.73884 1 7.50027 3.23858 7.50027 6M17.5003 6H18.809C20.8947 6 21.9375 6 22.5338 6.66616C23.13 7.33231 23.0148 8.36879 22.7845 10.4417L22.4887 13.1043C22.0185 17.3356 21.7835 19.4513 20.3597 20.7256C18.9359 22 16.7907 22 12.5003 22C8.20987 22 6.06467 22 4.64087 20.7256C3.21707 19.4513 2.982 17.3356 2.51186 13.1043L2.21601 10.4417C1.98569 8.36879 1.87052 7.33231 2.46676 6.66616C3.063 6 4.10585 6 6.19155 6H7.50027M17.5003 6H7.50027M18.5003 10H6.50027"
              svgStroke="#6E6E6E"
              pathFill=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
            />
            <SideBarItem
              router="/photoshoot"
              svgWidth="25"
              svgHeight="24"
              svgViewBox="0 0 25 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M9.5 20.5L12.1727 15.7714C12.3024 15.5419 12.4163 15.3404 12.5182 15.1622M12.5182 15.1622C12.8341 14.6097 13.035 14.2806 13.2358 14.0336C14.8978 11.9885 17.8618 11.5845 20.0106 13.1101C20.3516 13.3522 20.7309 13.7309 21.485 14.485M12.5182 15.1622L12 15C10.8045 14.7609 10.2067 14.6413 9.65808 14.653C8.18985 14.6842 6.80956 15.3593 5.88354 16.4991C5.53751 16.925 5.26489 17.4702 4.71965 18.5607L4.60982 18.7804L4.48875 18.9849M21.485 14.485C21.5 13.7605 21.5 12.939 21.5 12C21.5 8.25027 21.5 6.3754 20.5451 5.06107C20.2367 4.6366 19.8634 4.26331 19.4389 3.95491C18.1246 3 16.2497 3 12.5 3C8.75027 3 6.8754 3 5.56107 3.95491C5.1366 4.26331 4.76331 4.6366 4.45491 5.06107C3.5 6.3754 3.5 8.25027 3.5 12C3.5 15.7497 3.5 17.6246 4.45491 18.9389C4.46611 18.9543 4.47738 18.9697 4.48875 18.9849M21.485 14.485C21.4401 16.6536 21.2609 17.9537 20.5451 18.9389C20.2367 19.3634 19.8634 19.7367 19.4389 20.0451C18.1246 21 16.2497 21 12.5 21C8.75027 21 6.8754 21 5.56107 20.0451C5.152 19.7479 4.79047 19.3904 4.48875 18.9849M9.5 9C9.5 10.1046 10.3954 11 11.5 11C12.6046 11 13.5 10.1046 13.5 9C13.5 7.89543 12.6046 7 11.5 7C10.3954 7 9.5 7.89543 9.5 9Z"
              svgStroke="#6E6E6E"
              pathFill=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
              secondPathD=""
            />
            <SideBarItem
              router="/profile"
              svgWidth="25"
              svgHeight="24"
              svgViewBox="0 0 25 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M15.75 6C15.75 7.79493 14.2949 9.25 12.5 9.25V10.75C15.1234 10.75 17.25 8.62335 17.25 6H15.75ZM12.5 9.25C10.7051 9.25 9.25 7.79493 9.25 6H7.75C7.75 8.62335 9.87665 10.75 12.5 10.75V9.25ZM9.25 6C9.25 4.20507 10.7051 2.75 12.5 2.75V1.25C9.87665 1.25 7.75 3.37665 7.75 6H9.25ZM12.5 2.75C14.2949 2.75 15.75 4.20507 15.75 6H17.25C17.25 3.37665 15.1234 1.25 12.5 1.25V2.75ZM9.5 13.75H15.5V12.25H9.5V13.75ZM15.5 20.25H9.5V21.75H15.5V20.25ZM9.5 20.25C7.70507 20.25 6.25 18.7949 6.25 17H4.75C4.75 19.6234 6.87665 21.75 9.5 21.75V20.25ZM18.75 17C18.75 18.7949 17.2949 20.25 15.5 20.25V21.75C18.1234 21.75 20.25 19.6234 20.25 17H18.75ZM15.5 13.75C17.2949 13.75 18.75 15.2051 18.75 17H20.25C20.25 14.3766 18.1234 12.25 15.5 12.25V13.75ZM9.5 12.25C6.87665 12.25 4.75 14.3766 4.75 17H6.25C6.25 15.2051 7.70507 13.75 9.5 13.75V12.25Z"
              pathFill="#6E6E6E"
              svgStroke=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
              secondPathD=""
            />
            <SideBarItem
              router="/about-us"
              svgWidth="25"
              svgHeight="24"
              svgViewBox="0 0 25 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M5.56107 20.0451L6.00191 19.4383L5.56107 20.0451ZM4.45491 18.9389L5.06168 18.4981L4.45491 18.9389ZM20.5451 18.9389L19.9383 18.4981L20.5451 18.9389ZM19.4389 20.0451L18.9981 19.4383L19.4389 20.0451ZM19.4389 3.95491L18.9981 4.56168L19.4389 3.95491ZM20.5451 5.06107L19.9383 5.50191L20.5451 5.06107ZM5.56107 3.95491L6.00191 4.56168L5.56107 3.95491ZM4.45491 5.06107L5.06168 5.50191L4.45491 5.06107ZM13.25 11C13.25 10.5858 12.9142 10.25 12.5 10.25C12.0858 10.25 11.75 10.5858 11.75 11H13.25ZM11.75 17C11.75 17.4142 12.0858 17.75 12.5 17.75C12.9142 17.75 13.25 17.4142 13.25 17H11.75ZM12.5 20.25C10.6084 20.25 9.24999 20.249 8.19804 20.135C7.16013 20.0225 6.50992 19.8074 6.00191 19.4383L5.12023 20.6518C5.92656 21.2377 6.87094 21.5 8.03648 21.6263C9.18798 21.751 10.6418 21.75 12.5 21.75V20.25ZM2.75 12C2.75 13.8582 2.74897 15.312 2.87373 16.4635C3.00001 17.6291 3.26232 18.5734 3.84815 19.3798L5.06168 18.4981C4.69259 17.9901 4.47745 17.3399 4.365 16.302C4.25103 15.25 4.25 13.8916 4.25 12H2.75ZM6.00191 19.4383C5.64111 19.1762 5.32382 18.8589 5.06168 18.4981L3.84815 19.3798C4.20281 19.8679 4.63209 20.2972 5.12023 20.6518L6.00191 19.4383ZM20.75 12C20.75 13.8916 20.749 15.25 20.635 16.302C20.5225 17.3399 20.3074 17.9901 19.9383 18.4981L21.1518 19.3798C21.7377 18.5734 22 17.6291 22.1263 16.4635C22.251 15.312 22.25 13.8582 22.25 12H20.75ZM12.5 21.75C14.3582 21.75 15.812 21.751 16.9635 21.6263C18.1291 21.5 19.0734 21.2377 19.8798 20.6518L18.9981 19.4383C18.4901 19.8074 17.8399 20.0225 16.802 20.135C15.75 20.249 14.3916 20.25 12.5 20.25V21.75ZM19.9383 18.4981C19.6762 18.8589 19.3589 19.1762 18.9981 19.4383L19.8798 20.6518C20.3679 20.2972 20.7972 19.8679 21.1518 19.3798L19.9383 18.4981ZM12.5 3.75C14.3916 3.75 15.75 3.75103 16.802 3.865C17.8399 3.97745 18.4901 4.19259 18.9981 4.56168L19.8798 3.34815C19.0734 2.76232 18.1291 2.50001 16.9635 2.37373C15.812 2.24897 14.3582 2.25 12.5 2.25V3.75ZM22.25 12C22.25 10.1418 22.251 8.68798 22.1263 7.53648C22 6.37094 21.7377 5.42656 21.1518 4.62023L19.9383 5.50191C20.3074 6.00992 20.5225 6.66013 20.635 7.69804C20.749 8.74999 20.75 10.1084 20.75 12H22.25ZM18.9981 4.56168C19.3589 4.82382 19.6762 5.14111 19.9383 5.50191L21.1518 4.62023C20.7972 4.13209 20.3679 3.70281 19.8798 3.34815L18.9981 4.56168ZM12.5 2.25C10.6418 2.25 9.18798 2.24897 8.03648 2.37373C6.87094 2.50001 5.92656 2.76232 5.12023 3.34815L6.00191 4.56168C6.50992 4.19259 7.16013 3.97745 8.19804 3.865C9.24999 3.75103 10.6084 3.75 12.5 3.75V2.25ZM4.25 12C4.25 10.1084 4.25103 8.74999 4.365 7.69804C4.47745 6.66013 4.69259 6.00992 5.06168 5.50191L3.84815 4.62023C3.26232 5.42656 3.00001 6.37094 2.87373 7.53648C2.74897 8.68798 2.75 10.1418 2.75 12H4.25ZM5.12023 3.34815C4.63209 3.70281 4.20281 4.13209 3.84815 4.62023L5.06168 5.50191C5.32382 5.14111 5.64111 4.82382 6.00191 4.56168L5.12023 3.34815ZM11.75 11V17H13.25V11H11.75Z"
              svgStroke=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
              pathFill="#6E6E6E"
              secondPathD="M13.5 8C13.5 8.55228 13.0523 9 12.5 9C11.9477 9 11.5 8.55228 11.5 8C11.5 7.44772 11.9477 7 12.5 7C13.0523 7 13.5 7.44772 13.5 8Z"
            />
            <SideBarItem
              router="/rules"
              svgWidth="25"
              svgHeight="24"
              svgViewBox="0 0 25 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M5.56107 21.0451L6.00191 20.4383L5.56107 21.0451ZM4.45491 19.9389L5.06168 19.4981L4.45491 19.9389ZM20.5451 19.9389L19.9383 19.4981L20.5451 19.9389ZM19.4389 21.0451L18.9981 20.4383L19.4389 21.0451ZM19.4389 2.95491L18.9981 3.56168L19.4389 2.95491ZM20.5451 4.06107L19.9383 4.50191L20.5451 4.06107ZM5.56107 2.95491L6.00191 3.56168L5.56107 2.95491ZM4.45491 4.06107L5.06168 4.50191L4.45491 4.06107ZM8.5 15.25C8.08579 15.25 7.75 15.5858 7.75 16C7.75 16.4142 8.08579 16.75 8.5 16.75V15.25ZM16.5 16.75C16.9142 16.75 17.25 16.4142 17.25 16C17.25 15.5858 16.9142 15.25 16.5 15.25V16.75ZM8.5 11.25C8.08579 11.25 7.75 11.5858 7.75 12C7.75 12.4142 8.08579 12.75 8.5 12.75V11.25ZM16.5 12.75C16.9142 12.75 17.25 12.4142 17.25 12C17.25 11.5858 16.9142 11.25 16.5 11.25V12.75ZM8.5 7.25C8.08579 7.25 7.75 7.58579 7.75 8C7.75 8.41421 8.08579 8.75 8.5 8.75V7.25ZM11.5 8.75C11.9142 8.75 12.25 8.41421 12.25 8C12.25 7.58579 11.9142 7.25 11.5 7.25V8.75ZM20.75 11V13H22.25V11H20.75ZM4.25 13V11H2.75V13H4.25ZM12.5 21.25C10.6084 21.25 9.24999 21.249 8.19804 21.135C7.16013 21.0225 6.50992 20.8074 6.00191 20.4383L5.12023 21.6518C5.92656 22.2377 6.87094 22.5 8.03648 22.6263C9.18798 22.751 10.6418 22.75 12.5 22.75V21.25ZM2.75 13C2.75 14.8582 2.74897 16.312 2.87373 17.4635C3.00001 18.6291 3.26232 19.5734 3.84815 20.3798L5.06168 19.4981C4.69259 18.9901 4.47745 18.3399 4.365 17.302C4.25103 16.25 4.25 14.8916 4.25 13H2.75ZM6.00191 20.4383C5.64111 20.1762 5.32382 19.8589 5.06168 19.4981L3.84815 20.3798C4.20281 20.8679 4.63209 21.2972 5.12023 21.6518L6.00191 20.4383ZM20.75 13C20.75 14.8916 20.749 16.25 20.635 17.302C20.5225 18.3399 20.3074 18.9901 19.9383 19.4981L21.1518 20.3798C21.7377 19.5734 22 18.6291 22.1263 17.4635C22.251 16.312 22.25 14.8582 22.25 13H20.75ZM12.5 22.75C14.3582 22.75 15.812 22.751 16.9635 22.6263C18.1291 22.5 19.0734 22.2377 19.8798 21.6518L18.9981 20.4383C18.4901 20.8074 17.8399 21.0225 16.802 21.135C15.75 21.249 14.3916 21.25 12.5 21.25V22.75ZM19.9383 19.4981C19.6762 19.8589 19.3589 20.1762 18.9981 20.4383L19.8798 21.6518C20.3679 21.2972 20.7972 20.8679 21.1518 20.3798L19.9383 19.4981ZM12.5 2.75C14.3916 2.75 15.75 2.75103 16.802 2.865C17.8399 2.97745 18.4901 3.19259 18.9981 3.56168L19.8798 2.34815C19.0734 1.76232 18.1291 1.50001 16.9635 1.37373C15.812 1.24897 14.3582 1.25 12.5 1.25V2.75ZM22.25 11C22.25 9.14184 22.251 7.68798 22.1263 6.53648C22 5.37094 21.7377 4.42656 21.1518 3.62023L19.9383 4.50191C20.3074 5.00992 20.5225 5.66013 20.635 6.69804C20.749 7.74999 20.75 9.10843 20.75 11H22.25ZM18.9981 3.56168C19.3589 3.82382 19.6762 4.14111 19.9383 4.50191L21.1518 3.62023C20.7972 3.13209 20.3679 2.70281 19.8798 2.34815L18.9981 3.56168ZM12.5 1.25C10.6418 1.25 9.18798 1.24897 8.03648 1.37373C6.87094 1.50001 5.92656 1.76232 5.12023 2.34815L6.00191 3.56168C6.50992 3.19259 7.16013 2.97745 8.19804 2.865C9.24999 2.75103 10.6084 2.75 12.5 2.75V1.25ZM4.25 11C4.25 9.10843 4.25103 7.74999 4.365 6.69804C4.47745 5.66013 4.69259 5.00992 5.06168 4.50191L3.84815 3.62023C3.26232 4.42656 3.00001 5.37094 2.87373 6.53648C2.74897 7.68798 2.75 9.14184 2.75 11H4.25ZM5.12023 2.34815C4.63209 2.70281 4.20281 3.13209 3.84815 3.62023L5.06168 4.50191C5.32382 4.14111 5.64111 3.82382 6.00191 3.56168L5.12023 2.34815ZM8.5 16.75H16.5V15.25H8.5V16.75ZM8.5 12.75H16.5V11.25H8.5V12.75ZM8.5 8.75H11.5V7.25H8.5V8.75Z"
              svgStroke=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
              secondPathD=""
              pathFill="#6E6E6E"
            />
            <SideBarItem
              styles=" side-bar__nav-link-exit"
              router="/sign-in"
              svgWidth="24"
              svgHeight="24"
              svgViewBox="0 0 24 24"
              svgFill="none"
              svgXmlns="http://www.w3.org/2000/svg"
              svgD="M8.91919 2.25C8.06717 2.24994 7.54819 2.2499 7.10051 2.3208C4.64013 2.71049 2.71049 4.64013 2.3208 7.10051C2.2499 7.54819 2.24994 8.06717 2.25 8.91919L2.25 15.0808C2.24994 15.9328 2.2499 16.4518 2.3208 16.8995C2.71049 19.3599 4.64013 21.2895 7.10051 21.6792C7.54819 21.7501 8.06718 21.7501 8.91921 21.75L10 21.75C11.2936 21.75 12.4894 21.3219 13.4504 20.6C13.7816 20.3513 13.8485 19.8811 13.5997 19.5499C13.3509 19.2188 12.8808 19.1519 12.5496 19.4007C11.8393 19.9342 10.9576 20.25 10 20.25H9.00001C8.04234 20.25 7.65083 20.2477 7.33516 20.1977C5.51662 19.9097 4.09036 18.4834 3.80233 16.6649C3.75234 16.3492 3.75001 15.9577 3.75001 15L3.75001 9.00001C3.75001 8.04234 3.75234 7.65083 3.80233 7.33516C4.09036 5.51662 5.51662 4.09036 7.33516 3.80233C7.65083 3.75234 8.04234 3.75001 9.00001 3.75001H10C10.9576 3.75001 11.8393 4.06583 12.5496 4.59932C12.8808 4.84808 13.3509 4.78127 13.5997 4.45008C13.8485 4.11888 13.7816 3.64874 13.4504 3.39997C12.4894 2.67807 11.2936 2.25001 10 2.25001L8.91919 2.25Z"
              svgStroke=""
              svgStrokeWidth="1.5"
              svgStrokeLinecap="round"
              secondPathD="M17.466 7.41232C17.1414 7.15498 16.6697 7.20947 16.4123 7.53404C16.155 7.85861 16.2095 8.33034 16.534 8.58769L18.297 9.98554C19.001 10.5438 19.483 10.9274 19.8105 11.25L7.00001 11.25C6.58579 11.25 6.25001 11.5858 6.25001 12C6.25001 12.4142 6.58579 12.75 7.00001 12.75L19.8105 12.75C19.483 13.0727 19.001 13.4563 18.297 14.0145L16.534 15.4123C16.2095 15.6697 16.155 16.1414 16.4123 16.466C16.6697 16.7905 17.1414 16.845 17.466 16.5877L19.2648 15.1615C19.9372 14.6283 20.4922 14.1883 20.8875 13.7945C21.2932 13.3904 21.6295 12.9419 21.7208 12.3687C21.7402 12.2466 21.75 12.1234 21.75 12C21.75 11.8766 21.7402 11.7534 21.7208 11.6313C21.6295 11.0582 21.2932 10.6096 20.8875 10.2055C20.4922 9.81173 19.9373 9.37176 19.2648 8.83858L17.466 7.41232Z"
              pathFill="#6E6E6E"
            />
          </ul>
        </nav>
      </div>
      <ul className="side-bar__social-list">
        <SocialItem href="vk.com" icon={vkIcon} alt="иконка вконтакте" />
        <SocialItem
          href="whatsapp.com"
          icon={whatsAppIcon}
          alt="иконка WhatsApp"
        />
        <SocialItem
          href="telegram.org"
          icon={telegramIcon}
          alt="иконка telegram"
        />
      </ul>
    </div>
  );
};
