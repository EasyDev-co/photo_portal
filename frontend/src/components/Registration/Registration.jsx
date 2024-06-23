import InputField from "../InputField/InputField";
import styles from "./Registration.module.css";
import { useState } from "react";
import yandex from '../../assets/images/socials/Я.svg'
import vk from '../../assets/images/socials/Vkcolor.svg'
import google from '../../assets/images/socials/G.svg'
import mail from '../../assets/images/socials/mail-ru-svgrepo-com.svg'
import apple from '../../assets/images/socials/apple-logo-svgrepo-com.svg'
import { Link } from "react-router-dom";
export const Registration = () => {
  const[activeBlur,setActiveBlur] = useState(false)
  const [inputValue, setInputValue] = useState({
    gardenCode: '',
    pictureNumbers: '',
    fullName: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const onChangeHandler = (event) => {
    const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
    setInputValue(newInput);
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(inputValue)
  }

  return <>
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={activeBlur?styles.blurContainer:' '}></div>
        <div className={styles.regFormWrap}>
          <div className={styles.regFormContainer}>
            <h1 className={styles.formHeader}>Регистрация</h1>
            <form onSubmit={(e)=>onSubmitHandler(e)} className={styles.regForm} action="">
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
              <InputField
                name={'fullName'}
                onChangeHandler={onChangeHandler}
                placeholder={'ФИО'}
                isNone
                isAuthForm
                value={inputValue.fullName}
              />
              <InputField
                name={'email'}
                onChangeHandler={onChangeHandler}
                placeholder={'Электронный адрес'}
                isNone
                isAuthForm
                value={inputValue.email}
              />
              <InputField
                name={'password'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Пароль'}
                isAuthForm
                value={inputValue.password}
              />
              <InputField
                name={'repeatPassword'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Повторить пароль'}
                isAuthForm
                value={inputValue.repeatPassword}
              />

              <div className={styles.privacyCheckbox}>
                <input type="checkbox" name="" id="privacy" />
                <label htmlFor="privacy">
                  <p>
                    Даю согласие на обработку своих персональных данных.
                    <span> С соглашением ознакомлен.</span>
                  </p>

                </label>
              </div>
              <button className={styles.authButton}>Продолжить</button>
            </form>
            <div className={styles.loginLinkWrap}>
              <p>Если есть аккаунт, выполните <Link to={'/sign-in'}><span className={styles.loginEnter}>Вход</span> </Link> </p>
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
  </>;
};
