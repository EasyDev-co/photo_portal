/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from "./Header.module.css";
import React, { useState, useEffect } from "react";
import { HeaderUserInfoItem } from "../HeaderUserInfoItem/HeaderUserInfoItem";
import { NavBar } from "../NavBar/NavBar";
import { ButtonBurger } from "./ButtonBurger/ButtonBurger";
import { logo } from "../../constants/constants";
import { fetchUserDataWithTokenInterceptor } from "../../http/user/getUserData";
import { useDispatch, useSelector } from "react-redux";
import { addUserData, setUser } from "../../store/authSlice";
import { getCookie } from "../../utils/setCookie";
import { useAuth } from "../../utils/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { OAuthGetToken } from "../../http/OAuth/OAuth";

export const Header = () => {
  const [cookieData, setCookieData] = useState(getCookie('refresh'));
  const [navBarState, setNavBarState] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const refresh = useSelector(state => state.user.refresh);
  const accessStor = localStorage.getItem('access');

  const [localStorageValue, setLocalStorageValue] = useState({
    last_name: localStorage.getItem('last_name'),
    first_name: localStorage.getItem('first_name'),
    second_name: localStorage.getItem('second_name'),
    phone: localStorage.getItem('phone')
  })
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const toggleNavBar = () => {
    setNavBarState(!navBarState);
  };

  useEffect(() => {
    // Проверка и обновление значений каждую секунду
    const intervalId = setInterval(() => {
      const updatedValues = {
        last_name: localStorage.getItem('last_name'),
        first_name: localStorage.getItem('first_name'),
        second_name: localStorage.getItem('second_name'),
        phone: localStorage.getItem('phone')
      };

      // Обновление состояния только если значения изменились
      if (JSON.stringify(updatedValues) !== JSON.stringify(localStorageValue)) {
        setLocalStorageValue(updatedValues);
      }
    }, 1000); // Проверка каждую секунду

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [localStorageValue]);
  useEffect(() => {
    if (!localStorage.getItem('access')) {
      return;
    }
    fetchUserDataWithTokenInterceptor(accessStor, refresh)
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              dispatch(addUserData(res));
            });
        };
      });
  }, [accessStor, cookieData, dispatch, refresh]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768) {
      setNavBarState(false);
    }
  }, [windowWidth]);

  function getTokenFromUrl(url) {
    if (url.includes('auth/callback')) {
      const queryString = url.split('?')[1];
      if (queryString) {
        const params = queryString.split('&');
        for (const param of params) {
          if (param.startsWith('token=')) {
            return param.split('=')[1];
          };
        };
      };
    };
    return null;
  }

  useEffect(() => {
    let token = getTokenFromUrl(window.location.href);
    if (!token) {
      return;
    };
    OAuthGetToken({
      provider: localStorage.getItem('pr__r'),
      access_token: token
    })
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              dispatch(setUser(res));
            })
            .then(()=>{
              navigate('/orders');
            });
        }
      });
  }, []);

  useEffect(() => {
    if (navBarState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [navBarState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedValues = {
        last_name: localStorage.getItem('last_name') || '',
        first_name: localStorage.getItem('first_name') || '',
        second_name: localStorage.getItem('second_name') || '',
        phone: localStorage.getItem('phone') || ''
      };

      if (JSON.stringify(updatedValues) !== JSON.stringify(localStorageValue)) {
        setLocalStorageValue(updatedValues);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [localStorageValue]);

  return (
    <>
      <header
        className={`${styles.header} ${navBarState ? styles.openMenu : ""}`}
        id="header"
      >
        <div className={styles.container}>
          <div onClick={() => navigate("/about-us")} className={styles.leftBlock}>
            <img className={styles.logo} src={logo} alt="логотип" />
          </div>
          {isAuth ?
            <div className={styles.rightBlock}>
              <ul className={styles.userInfoList}>
                <HeaderUserInfoItem
                  top={`${localStorage.getItem('last_name') === null ? '' : localStorage.getItem('last_name')} 
                  ${localStorage.getItem('first_name') === null ? '' : localStorage.getItem('first_name')} 
                  ${localStorage.getItem('second_name') === null ? '' : localStorage.getItem('second_name')}`}
                  bottom={localStorage.getItem('phone')}
                />
                <HeaderUserInfoItem
                  isKindergarten
                  top={`${localStorage.getItem('country') === null ? '' : localStorage.getItem('country')}, 
                  ${localStorage.getItem('regionName') === null ? '' : localStorage.getItem('regionName')}`}
                  bottom={localStorage.getItem('kindergarten') === null ? '' : localStorage.getItem('kindergarten')}
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
          <NavBar localStorageValue={localStorageValue} onClose={toggleNavBar} navBarState={navBarState} />
        )}
      </header>
    </>
  );
};
