import InputField from "../InputField/InputField";
import styles from "./Registration.module.css";
import { useState } from "react";
import yandex from '../../assets/images/socials/Я.svg'
import vk from '../../assets/images/socials/Vkcolor.svg'
import google from '../../assets/images/socials/G.svg'
import mail from '../../assets/images/socials/mail-ru-svgrepo-com.svg'
import apple from '../../assets/images/socials/apple-logo-svgrepo-com.svg'
import InputAuth from "../InputField/InputAuth";
export const Registration = () => {
  const [inputValue, setInputValue] = useState({
    // parentSurname: '',
    // parentName: '',
    // parentPatronymic: '',
    // parentPhone: '',
    // parentEmail: '',
    // kindergarten: '',
    // parentCity: '',
    // parentPass: '',
    // parentNewPass: '',
    // resetEmail: ''
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
        <div className={styles.regFormWrap}>
          <div className={styles.regFormContainer}>
            <h1>Регистрация</h1>
            <form className={styles.regForm} action="">
              <InputField
                name={'gardenCode'}
                placeholder={'Код сада'}
                onChangeHandler={onChangeHandler}
                isQuestions
                isAuthForm
              />
              <InputField
                name={'pictureNumbers'}
                onChangeHandler={onChangeHandler}
                placeholder={'Номера кадров'}
                isQuestions
                isAuthForm
              />
              <InputField
                name={'fullName'}
                onChangeHandler={onChangeHandler}
                placeholder={'ФИО'}
                isNone
                isAuthForm
              />
              <InputField
                name={'email'}
                onChangeHandler={onChangeHandler}
                placeholder={'Электронный адрес'}
                isNone
                isAuthForm

              />
              <InputField
                name={'password'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Пароль'}
                isAuthForm
              />
              <InputField
                name={'repeatPassword'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Повторить пароль'}
                isAuthForm
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
              <p>Если есть аккаунт, выполните <span> Вход</span></p>
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
