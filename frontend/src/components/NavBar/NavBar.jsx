import styles from "./NavBar.module.css";
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
    <div className={styles.navBar}>
      <div className={styles.container}>
        <ul className={styles.userInfoList}>
          <HeaderUserInfoItem
            top={`${userInfo.surname} ${userInfo.name} ${userInfo.patronymic}`}
            bottom={userInfo.tel}
          />
          <HeaderUserInfoItem
            top={`${userInfo.country} ${userInfo.city}`}
            bottom={userInfo.kindergarten}
          />
        </ul>
        <ul className={styles.navList}>
          <NavBarItem
            router="/orders"
            icon={bagIcon}
            alt="иконка корзины"
            text="Заказы"
            onClick={onClose}
          />
          <NavBarItem
            router="/gallery"
            icon={imageIcon}
            alt="иконка картинки"
            text="Галерея"
            onClick={onClose}
          />
          <NavBarItem
            router="/profile"
            icon={profileIcon}
            alt="иконка профиля"
            text="Личный кабинет"
            onClick={onClose}
          />
          <NavBarItem
            router="/about-us"
            icon={infoIcon}
            alt="иконка инфо"
            text="О нас"
            onClick={onClose}
          />
          <NavBarItem
            router="/rules"
            icon={rulesIcon}
            alt="иконка правил"
            text="Правила"
            onClick={onClose}
          />
          <NavBarItem
            router="/sign-in"
            icon={exitIcon}
            alt="иконка выхода"
            text="Выход"
            onClick={onClose}
          />
        </ul>
        <ul className={styles.socialList}>
          <SocialItem
            href="https://vk.com"
            icon={vkIcon}
            alt="иконка вконтакте"
          />
          <SocialItem
            href="https://whatsapp.com"
            icon={whatsAppIcon}
            alt="иконка WhatsApp"
          />
          <SocialItem
            href="https://telegram.org"
            icon={telegramIcon}
            alt="иконка telegram"
          />
        </ul>
      </div>
    </div>
  );
};
