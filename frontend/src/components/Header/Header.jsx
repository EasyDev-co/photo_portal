import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { HeaderUserInfoItem } from "../HeaderUserInfoItem/HeaderUserInfoItem";
import { NavBar } from "../NavBar/NavBar";
import { ButtonBurger } from "./ButtonBurger/ButtonBurger";
import { logo, userInfo } from "../../constants/constants";

export const Header = () => {
  const [navBarState, setNavBarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const toggleNavBar = () => {
    setNavBarState(!navBarState);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Условие для смены состояния navbarState при изменении ширины экрана
  useEffect(() => {
    if (windowWidth > 768) {
      setNavBarState(false);
    }
  }, [windowWidth]);

  // Предотвращение прокрутки страницы при открытом навбаре
  useEffect(() => {
    if (navBarState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [navBarState]);

  return (
    <>
      <header
        className={`${styles.header} ${navBarState ? styles.openMenu : ""}`}
        id="header"
      >
        <div className={styles.container}>
          <div className={styles.leftBlock}>
            <img className={styles.logo} src={logo} alt="логотип" />
          </div>

          <div className={styles.rightBlock}>
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
          </div>
          {windowWidth <= 768 && (
            <>
              {navBarState ? (
                <button
                  className={styles.barCloseButton}
                  onClick={toggleNavBar}
                />
              ) : (
                <ButtonBurger onClick={toggleNavBar} />
              )}
            </>
          )}
        </div>
        {windowWidth <= 768 && navBarState && (
          <NavBar onClose={toggleNavBar} navBarState={navBarState} />
        )}
      </header>
    </>
  );
};
