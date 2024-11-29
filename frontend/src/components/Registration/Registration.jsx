import InputField from "../InputField/InputField";
import styles from "./Registration.module.css";
import { useState, useRef, useEffect } from "react";
import yandex from '../../assets/images/socials/Я.svg'
import vk from '../../assets/images/socials/Vkcolor.svg'
import google from '../../assets/images/socials/G.svg'
import mail from '../../assets/images/socials/mail-ru-svgrepo-com.svg'
import apple from '../../assets/images/socials/apple-logo-svgrepo-com.svg'
import { Link, useNavigate , useLocation } from "react-router-dom";
import { parentRegisterCreate } from "../../http/parent/parentRegisterCreate";
import { useDispatch, useSelector } from "react-redux";
import { addQrIdPhoto, setEmail, setPhotoNumbers } from "../../store/authSlice";
import { useClickOutside } from "../../utils/useClickOutside";
import danger from '../../assets/images/Auth/DangerCircle.svg'
import Scaner from "../Scaner/Scaner";
import Modal from "../Modal/Modlal";
import agreementPdf from '../../assets/agreement.pdf'

export const Registration = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isChecked, setIsChecked] = useState(false);
  const accessStor = localStorage.getItem('access');
  const navigate = useNavigate();

  useEffect(() => {
    if (accessStor) {
      navigate('/orders')
    }
  }, [])

  const initialState = {
    gardenCode: '',
    pictureNumbers: '',
    fullName: '',
    email: '',
    password: '',
    repeatPassword: ''
  };

  const [modalActive, setModalActive] = useState(false);
  const [activeBlur, setActiveBlur] = useState(false);
  const [inputValue, setInputValue] = useState(initialState);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState({
    email: '',
    detail: '',
    first_name: '',
    last_name: '',
    second_name: '',
    password: '',
    isChecked: '',
    repeatPass: '',
    pictureNumbers: ''
  });
  const [errorName, setErrorName] = useState({
    text: ''
  });
  const navigation = useNavigate();
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
    const inputValue = event.target.value
    const newInput = (data) => ({ ...data, [event.target.name]: inputValue });
    setInputValue(newInput);
  };

  const blurRef = useRef(null);

  useClickOutside(blurRef, () => {
    setActiveBlur(false)
  })

  function validateFullName(input) {
    // Регулярное выражение для проверки кириллических букв
    const cyrillicPattern = /^[А-ЯЁа-яё]+$/;

    // Разделяем строку на слова
    const words = input.trim().split(/\s+/);

    // Проверяем, что слов ровно три
    if (words.length < 2) {
      setErrorName({
        text: ['Длинна этого поля не может быть короче 1 слова.']
      })
      return
    }

    if (words[0].length <= 2) {
      setErrorName({
        text: ['Длинна в этом поле не может быть короче 2 символов.']
      })
      return
    }
    if (words[1].length <= 2) {
      setErrorName({
        text: ['Длинна в этом поле не может быть короче 2 символов.']
      })
      return
    }

    for (let word of words) {
      if (word.length >= 57) {
        setErrorName({
          text: ['Слишком много символов.']
        })
        return
      }
    }
    // Проверяем каждое слово на соответствие регулярному выражению
    for (let word of words) {
      if (!cyrillicPattern.test(word)) {
        setErrorName({
          text: ['Можно вводить только кириллические символы.']
        })
        return
      }
    }

    setErrorName({
      text: []
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const regex = /^(\d+|(\d+(([-,\s]| и? )\d+){5}))$/;

    if (inputValue.password !== inputValue.repeatPassword) {
      setError({ repeatPass: ['Пароли не совпадают!'] })
      return;
    }
    if (!isChecked) {
      setError({ isChecked: ['Пожалуйста, примите условия использования'] })
      return;
    }

    const words = inputValue.fullName.split(' ');
    const { gardenCode, pictureNumbers, fullName, email, password } = inputValue;
    if (regex.test(inputValue.pictureNumbers)) {
      try {
        const response = await parentRegisterCreate(email, words[1], words[2], words[0], password, gardenCode)
        if (response.ok) {
          const data = await response.json();
          dispatch(
            setEmail(inputValue.email)
          )
          setResponseData(data);
          dispatch(setPhotoNumbers(
            inputValue.pictureNumbers.split(/[-,\sи]+/).map(elem => {
              return Number(elem)
            })
          ))
          setInputValue(initialState);
          navigation('/verification');
          // navigation('/orders');
        } else {
          const data = await response.json();
          setError(data);
          validateFullName(inputValue.fullName)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      setError({ pictureNumbers: ['Неправильный формат ввода.' +
          ' Введите 1 или 6 номеров фото через дефис, запятую, пробел или "и".'] })
    }
  }

  return <>
    <div className={styles.login}>
      <Scaner
        modalActive={modalActive}
        setModalActive={setModalActive}
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
                error={error.detail ? [error.detail] : error.detail}
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
                error={error.pictureNumbers}
              />
              <InputField
                name={'fullName'}
                onChangeHandler={onChangeHandler}
                placeholder={'ФИО'}
                isNone
                isAuthForm
                setActiveBlur={setActiveBlur}
                value={inputValue.fullName}
                error={errorName.text}
              />
              <InputField
                name={'email'}
                onChangeHandler={onChangeHandler}
                placeholder={'Электронный адрес'}
                isNone
                isAuthForm
                setActiveBlur={setActiveBlur}
                value={inputValue.email}
                error={error.email}
              />
              <InputField
                name={'password'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Пароль'}
                isAuthForm
                setActiveBlur={setActiveBlur}
                value={inputValue.password}
                error={error.password}
              />
              <InputField
                name={'repeatPassword'}
                onChangeHandler={onChangeHandler}
                type={'password'}
                placeholder={'Повторить пароль'}
                isAuthForm
                setActiveBlur={setActiveBlur}
                value={inputValue.repeatPassword}
                error={error.repeatPass}
              />
              <div className={isChecked ? styles.privacyCheckbox : styles.privacyCheckboxUnCheck}>
                <input className={styles.privacyInput} onChange={(e) => setIsChecked(e.target.checked)} type="checkbox" name="" id="privacy" />
                {/* <label htmlFor="privacy"> */}
                  <p>
                    Даю согласие на обработку своих персональных данных. {' '}
                    {/* <span> С соглашением ознакомлен.</span> */}
                    <span 
                      style={{ cursor: 'pointer', color: 'blue', }}
                      role="button" 
                      tabIndex={0} 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = agreementPdf; // Путь к вашему файлу
                        link.download = 'agreement.pdf'; // Имя файла при загрузке
                        link.click();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          const link = document.createElement('a');
                          link.href = agreementPdf;
                          link.download = 'agreement.pdf';
                          link.click();
                        }
                      }}
                    >
                      С соглашением ознакомлен.
                    </span>

                  </p>
                {/* </label> */}
              </div>
              {error.isChecked &&
                error.isChecked?.map((elem, i) => {
                  return (
                    <div key={i} className={styles.wrongPass}>
                      <img src={danger} alt="" />
                      <span>{elem}</span>
                    </div>
                  )
                })
              }
              <button className={styles.authButton}>Продолжить</button>
            </form>
            <div className={styles.loginLinkWrap}>
              <p>Если есть аккаунт, выполните <Link to={'/sign-in'}><span className={styles.loginEnter}>Вход</span> </Link> </p>
              {/* <div className={styles.socialList}>
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
              </div> */}
            </div>
          </div>
          <Modal
            active={modalActive}
            setActive={setModalActive}
            text={'Пожалуйста, разрешите браузеру использовать веб-камеру!'}
          />
        </div>
      </div>
    </div>
  </>;
};
