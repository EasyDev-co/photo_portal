/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from "react";
import styles from "./Login.module.css";
import InputField from "../InputField/InputField";
import yandex from '../../assets/images/socials/Я.svg'
import vk from '../../assets/images/socials/Vkcolor.svg'
import google from '../../assets/images/socials/G.svg'
import mail from '../../assets/images/socials/mail-ru-svgrepo-com.svg'
import apple from '../../assets/images/socials/apple-logo-svgrepo-com.svg'
import { Link , useNavigate } from "react-router-dom";
import danger from '../../assets/images/Auth/DangerCircle.svg'

import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { parentLoginCreate } from "../../http/parent/parentLoginCreate";

export const Login = () => {
  const [activeBlur, setActiveBlur] = useState(false);
  const [wrongPassord, setWrongPassword] = useState(false);
  const [isActiveAuth, setIsActiveAuth] = useState(true);
  const [isActiveReset, setIsActiveReset] = useState(false);

  const [error, setError] = useState({
    non_field_errors:'',
  });
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const initialState = {
    gardenCode: '',
    pictureNumbers: '',
    fullName: '',
    email: '',
    password: '',
    repeatPassword: ''
  }
  const [inputValue, setInputValue] = useState(initialState);
  const onChangeHandler = (event) => {
    const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
    setInputValue(newInput);
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await parentLoginCreate(inputValue.email, inputValue.password)
      if (response.ok) {
        const data = await response.json();
        dispatch(
          setUser({
            access: data.access,
            refresh: data.refresh
          })
        )
        navigation('/')
      } else {
        const data = await response.json();
        setError(data);
      }
    } catch (error) {
      console.log(error)
    }
    setInputValue(initialState);

  }
  return (
    <>
      <div className={styles.login}>
        <div className={styles.container}>
          <div className={activeBlur ? styles.blurContainer : ' '}></div>
          <div className={styles.regFormWrap}>
            <div className={styles.regFormContainer}>
              <h1 className={styles.formHeader}>Вход</h1>
              <form onSubmit={(e) => onSubmitHandler(e)} className={styles.regForm} action="">
                {!isActiveAuth &&
                  <>
                    <InputField
                      name={'gardenCode'}
                      placeholder={'Код сада'}
                      onChangeHandler={onChangeHandler}
                      isQuestions
                      isAuthForm
                      value={inputValue.gardenCode}
                      activeBlur={activeBlur}
                      setActiveBlur={setActiveBlur}
                    />
                    <InputField
                      name={'pictureNumbers'}
                      onChangeHandler={onChangeHandler}
                      placeholder={'Номера кадров'}
                      isQuestions
                      isAuthForm
                      value={inputValue.pictureNumbers}
                      activeBlur={activeBlur}
                      setActiveBlur={setActiveBlur}
                    />
                  </>
                }
                <InputField
                  name={'email'}
                  onChangeHandler={onChangeHandler}
                  placeholder={'Электронный адрес'}
                  isNone
                  isAuthForm
                  value={inputValue.email}
                  error={error.non_field_errors}
                  setActiveBlur={setActiveBlur}
                />
                <InputField
                  name={'password'}
                  onChangeHandler={onChangeHandler}
                  type={'password'}
                  placeholder={'Пароль'}
                  isAuthForm
                  value={inputValue.password}
                  setActiveBlur={setActiveBlur}
                />
                {wrongPassord && <div className={styles.wrongPass}>
                  <img src={danger} alt="" />
                  <span>Пароль введен неверно</span>
                </div>}
                <Link to={'/password-reset'}> <span onClick={() => setIsActiveReset(!isActiveReset)} className={styles.resetPass}>Восстановить пароль</span></Link>
                <button className={styles.authButton}>Продолжить</button>
              </form>
              <div className={styles.loginLinkWrap}>
                <p>Еще не успели создать аккаунт <Link to={'/sign-up'}><span className={styles.loginEnter}>Зарегистрируйтесь</span> </Link></p>
                <div className={styles.socialList}>
                  <span>Войти через</span>
                  <div className={styles.socialWrap}>
                    <div>
                      <img className={styles.socialIcon} src={vk} alt="" />
                    </div>
                    <div>
                      <img className={styles.socialIcon} src={yandex} alt="" />
                    </div>
                    <div>
                      <img className={styles.socialIcon} src={google} alt="" />
                    </div>
                    <div>
                      <img className={styles.socialIcon} src={apple} alt="" />
                    </div>
                    <div>
                      <img className={styles.socialIcon} src={mail} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
