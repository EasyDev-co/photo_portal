import "./Header.css";
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

  return (
    <>
      <header className="header" id="header">
        <div className="header__container">
          <div className="header__left-block">
            <img className="header__logo" src={logo} alt="логотип" />
          </div>

          <div className="header__right-block">
            <ul className="header__user-info-list">
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
                  className="nav-bar__close-button"
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
