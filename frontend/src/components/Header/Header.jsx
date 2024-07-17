import styles from "./Header.module.css";
import React, { useState, useEffect, useRef } from "react";
import { HeaderUserInfoItem } from "../HeaderUserInfoItem/HeaderUserInfoItem";
import { NavBar } from "../NavBar/NavBar";
import { ButtonBurger } from "./ButtonBurger/ButtonBurger";
import { logo } from "../../constants/constants";
import { fetchUserDataWithTokenInterceptor, getUserData } from "../../http/getUserData";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../../store/authSlice";
import { getCookie } from "../../utils/setCookie";
import { useAuth } from "../../utils/useAuth";
import { Link } from "react-router-dom";

export const Header = () => {
  const [cookieData, setCookieData] = useState(getCookie('refresh'));
  const [navBarState, setNavBarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const refresh = useSelector(state => state.user.refresh);
  const accessStor = localStorage.getItem('access');
  const { isAuth } = useAuth();
  const toggleNavBar = () => {
    setNavBarState(!navBarState);
  };

  useEffect(() => {
    // Создаем экземпляр AbortController
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Определяем функцию для фетча данных
    const fetchData = () => {
      fetchUserDataWithTokenInterceptor(accessStor, refresh, { signal })
        .then(res => res.json())
        .then(res => {
          if (res.email) {
            dispatch(addUserData(res));
          }
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            console.log('Fetch запрос был отменен');
          } else {
            console.error('Произошла ошибка:', error);
          }
        });
    };
    if(isAuth){
      fetchData();
    }
    return () => {
      abortController.abort();
    };
  }, [cookieData])

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
          {isAuth ?
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
            </div> :
            <div className={styles.linkToAuth}>
              <Link to={'/sign-in'}>Войти</Link>
            </div>
          }

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
