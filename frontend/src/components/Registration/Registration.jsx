import InputField from "../InputField/InputField";
import styles from "./Registration.module.css";
import { useState, useRef, useEffect } from "react";
import yandex from '../../assets/images/socials/Я.svg'
import vk from '../../assets/images/socials/Vkcolor.svg'
import google from '../../assets/images/socials/G.svg'
import mail from '../../assets/images/socials/mail-ru-svgrepo-com.svg'
import apple from '../../assets/images/socials/apple-logo-svgrepo-com.svg'
import { Link, useNavigate } from "react-router-dom";
import { parentRegisterCreate } from "../../http/parentRegisterCreate";
import { useDispatch, useSelector } from "react-redux";
import { addQrIdPhoto, setEmail } from "../../store/authSlice";
import { useClickOutside } from "../../utils/useClickOutside";
import { useLocation } from "react-router-dom";
import Scaner from "../Scaner/Scaner";

export const Registration = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isChecked, setIsChecked] = useState(false);
  const initialState = {
    gardenCode:  '',
    pictureNumbers: '',
    fullName: '',
    email: '',
    password: '',
    repeatPassword: ''
  }

  const [activeBlur, setActiveBlur] = useState(false)
  const [inputValue, setInputValue] = useState(initialState);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigate();
  const email = useSelector(action => action.user.email);
  const dispatch = useDispatch();
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    let photos = [];
    searchParams.forEach((value, key) => {
      if (key === "photo") {
        photos.push(value);
      }
    });
    setInputValue({
      gardenCode: searchParams.get('kindergarten_code') || '',
      pictureNumbers: photos.join('-') || ''
    })
    dispatch(addQrIdPhoto(searchParams.get('photo_line_id')))
  }, [location.search]);

  const onChangeHandler = (event) => {
    const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
    setInputValue(newInput);
  };

  const blurRef = useRef(null);

  useClickOutside(blurRef, () => {
    setActiveBlur(false)
  })

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(inputValue.password !== inputValue.repeatPassword){
      setError('Пароли не совпадают!')
      return;
    }
    if(!isChecked){
      setError('Пожалуйста, примите условия использования')
      return;
    }
   
    const words = inputValue.fullName.split(' ');
    const { gardenCode, pictureNumbers, fullName, email, password } = inputValue;

    try {
      const response = await parentRegisterCreate(email, words[1], words[2], words[0], password, gardenCode)
      if (response.ok) {
        const data = await response.json();
        dispatch(
          setEmail(inputValue.email)
        )
        setResponseData(data);
        navigation('/verification');
      } else {
        const data = await response.json();
        setError(data);
      }
    } catch (error) {

    }
    setInputValue(initialState);
  }

  return <>
    <div className={styles.login}>
      <Scaner
        scanActive={scanActive}
        setScanActive={setScanActive}
      />
      <div className={styles.container}>
        <div className={activeBlur ? styles.blurContainer : ' '}></div>
        <div className={styles.regFormWrap}>
          <button onClick={() => setScanActive(!scanActive)} className={styles.qrCodeBtn}></button>
          <div className={styles.regFormContainer}>
            <h1 className={styles.formHeader}>Регистрация</h1>
            <form ref={blurRef} onSubmit={(e) => onSubmitHandler(e)} className={styles.regForm} action="">
              <InputField
                name={'gardenCode'}
                placeholder={'Код сада'}
                onChangeHandler={onChangeHandler}
                isQuestions
                isAuthForm
                value={inputValue.gardenCode}
                activeBlur={activeBlur}
                setActiveBlur={setActiveBlur}
                blurRef={blurRef}
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
                blurRef={blurRef}
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

              <div className={isChecked?styles.privacyCheckbox:styles.privacyCheckboxUnCheck}>
                <input className={styles.privacyInput} onChange={(e)=>setIsChecked(e.target.checked)} type="checkbox" name="" id="privacy" />
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
