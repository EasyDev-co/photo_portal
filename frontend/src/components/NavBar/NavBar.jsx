import "./NavBar.css";
import React, { useEffect } from "react";
import {
  bagIcon,
  imageIcon,
  profileIcon,
  infoIcon,
  rulesIcon,
  exitIcon,
  vkIcon,
  whatsAppIcon,
  telegramIcon,
  userInfo,
} from "../../constants/constants";
import { HeaderUserInfoItem } from "../HeaderUserInfoItem/HeaderUserInfoItem";
import { NavBarItem } from "./NavBarItem/NavBarItem";
import { SocialItem } from "../SocialItem/SocialItem";

export const NavBar = ({ onClose }) => {
  useEffect(() => {
    //обработчик для клавиши "Esc"
    const handleEsc = (e) => {
      //проверка на нажатие клавиши Esc (код клавиши 27)
      if (e.keyCode === 27) {
        onClose(); // вызывается функция закрытия попапа
      }
    };
    //слушатель события при монтировании компонента
    document.addEventListener("keydown", handleEsc);
    //убираем слушатель события при размонтировании компонента
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="nav-bar">
      <div className="nav-bar__container">
        <ul className="nav-bar__user-info-list">
          <HeaderUserInfoItem
            top={`${userInfo.surname} ${userInfo.name} ${userInfo.patronymic}`}
            bottom={userInfo.tel}
          />
          <HeaderUserInfoItem
            top={`${userInfo.country} ${userInfo.city}`}
            bottom={userInfo.kindergarten}
          />
        </ul>
        <ul className="nav-bar__nav-list">
          <NavBarItem
            router="/order"
            icon={bagIcon}
            alt="иконка корзины"
            text="Заказы"
          />
          <NavBarItem
            router="/photoshoot"
            icon={imageIcon}
            alt="иконка картинки"
            text="Галерея"
          />
          <NavBarItem
            router="/profile"
            icon={profileIcon}
            alt="иконка профиля"
            text="Личный кабинет"
          />
          <NavBarItem
            router="/about-us"
            icon={infoIcon}
            alt="иконка инфо"
            text="О нас"
          />
          <NavBarItem
            router="/rules"
            icon={rulesIcon}
            alt="иконка правил"
            text="Правила"
          />
          <NavBarItem
            router="/sign-in"
            icon={exitIcon}
            alt="иконка выхода"
            text="Выход"
          />
        </ul>
        <ul className="nav-bar__social-list">
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
    </div>
  );
};
