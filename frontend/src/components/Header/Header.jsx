import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { HeaderUserInfoItem } from "../HeaderUserInfoItem/HeaderUserInfoItem";
import { NavBar } from "../NavBar/NavBar";
import { ButtonBurger } from "./ButtonBurger/ButtonBurger";
import { logo, userInfo } from "../../constants/constants";
import { getUserData } from "../../http/getUserData";
import { tokenRefreshCreate } from "../../http/tokenRefreshCreate";
import { setCookie } from "../../utils/setCookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchRefreshToken, setAccessToken, fetchGetUserData } from "../../store/authSlice";
import { addUserData } from "../../store/authSlice";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { throttle } from "../../utils/throttle";
export const Header = () => {

  const [navBarState, setNavBarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const accessToken = useSelector(state => state.user.accessToken);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);

  const toggleNavBar = () => {
    setNavBarState(!navBarState);
  };
  // console.log(userData)
  const throttledTokenRefreshCreate = throttle(tokenRefreshCreate, 1000);

  useEffect(() => {

    throttledTokenRefreshCreate()
      .then(res => {
        if (res) {
          const { response, data } = res;
          if (response.ok) {
            setCookie('refresh', data.refresh);
            dispatch(
              setAccessToken(data.access)
            )
          }
          return data.access
        }
      })
      .then(access => {
        getUserData(access)
          .then(res => res.json())
          .then(res => {
            if (res.email) {
              dispatch(addUserData(res))
            }
          })
      })
  }, [])

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
                top={`${userData.last_name} ${userData.first_name} ${userData.second_name}`}
                bottom={userData.phone_number || ''}
              />
              <HeaderUserInfoItem
                top={`${localStorage.getItem('country')}, ${localStorage.getItem('regionName')}`}
                bottom={localStorage.getItem('kindergarten')}
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
