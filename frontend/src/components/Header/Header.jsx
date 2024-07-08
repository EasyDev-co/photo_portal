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
import { setAccessToken } from "../../store/authSlice";
import { addUserData } from "../../store/authSlice";
export const Header = () => {
  const [navBarState, setNavBarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const dispatch = useDispatch();
  const userData = useSelector(state=>state.user.userData);
  
  const toggleNavBar = () => {
    setNavBarState(!navBarState);
  };

  useEffect(()=>{
    tokenRefreshCreate()
      .then(res => res.json())
      .then(res => {
        if (res.refresh) {
          setCookie('refresh', res.refresh);
          dispatch(
            setAccessToken(res.access)
          )
        }
        return res.access
      })
      .then(access => {
        getUserData(access)
          .then(res => res.json())
          .then(res => {
            if(res){
              dispatch(addUserData(res))
          }
        })
      })
  },[dispatch])

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
