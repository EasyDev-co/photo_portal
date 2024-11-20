import { useState } from 'react';
import styles from './LoginCrm.module.css';
import InputField from '../../components/InputField/InputField';
import { useNavigate } from 'react-router-dom';
import danger from '../../assets/images/Auth/DangerCircle.svg';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';
import { parentLoginCreate } from '../../http/parent/parentLoginCreate';
import logo from '../../assets/icons/LogoCRM.png';

export const LoginCrm = () => {
  const initialState = {
    email: '',
    password: '',
  };

  const [activeBlur, setActiveBlur] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [inputValue, setInputValue] = useState(initialState);
  const [error, setError] = useState({
    non_field_errors: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const newInput = (data) => ({
      ...data,
      [event.target.name]: event.target.value,
    });
    setInputValue(newInput);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await parentLoginCreate(inputValue.email, inputValue.password);

      if (response.ok) {
        const data = await response.json();
        dispatch(
          setUser({
            access: data.access,
            refresh: data.refresh,
          })
        );

        // Перенаправление на CRM после успешного входа
        navigate('/crm/kindergartens');
      } else {
        const data = await response.json();
        setError({
          non_field_errors: data.non_field_errors || 'Проверьте правильность введенных данных!',
        });
        setWrongPassword(true);
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
    }

    setInputValue(initialState);
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={activeBlur ? styles.blurContainer : ''}></div>
        <div className={styles.block}>
          <img src={logo} alt="логотип" />
          <form onSubmit={onSubmitHandler} className={styles.form}>
            <InputField
              name="email"
              onChangeHandler={onChangeHandler}
              placeholder="Электронный адрес"
              isNone
              isAuthForm
              value={inputValue.email}
              error={error.non_field_errors}
              setActiveBlur={setActiveBlur}
            />
            <InputField
              name="password"
              onChangeHandler={onChangeHandler}
              type="password"
              placeholder="Пароль"
              isAuthForm
              value={inputValue.password}
              setActiveBlur={setActiveBlur}
            />
            {wrongPassword && (
              <div className={styles.wrongPass}>
                <img src={danger} alt="" />
                <span>Пароль введен неверно</span>
              </div>
            )}
            <button className={styles.authButton} type="submit">
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};



// import { useEffect, useState } from 'react'
// import styles from './LoginCrm.module.css'
// import InputField from '../../components/InputField/InputField'
// import { Link, useNavigate } from 'react-router-dom'
// import danger from '../../assets/images/Auth/DangerCircle.svg'
// import { useDispatch } from 'react-redux'
// import { setUser } from '../../store/authSlice'
// import { parentLoginCreate } from '../../http/parent/parentLoginCreate'
// import logo from '../../assets/icons/LogoCRM.png'

// export const LoginCrm = () => {
//   const initialState = {
//     email: '',
//     password: '',
//   }

//   const [activeBlur, setActiveBlur] = useState(false)
//   const [wrongPassord, setWrongPassword] = useState(false)
//   const [isActiveAuth, setIsActiveAuth] = useState(true)
//   const [inputValue, setInputValue] = useState(initialState)
//   const [error, setError] = useState({
//     non_field_errors: '',
//   })
//   const dispatch = useDispatch()
//   const navigation = useNavigate()

//   const onChangeHandler = (event) => {
//     const newInput = (data) => ({
//       ...data,
//       [event.target.name]: event.target.value,
//     })
//     setInputValue(newInput)
//   }

//   const onSubmitHandler = async (e) => {
//     e.preventDefault()

//     try {
//       const response = await parentLoginCreate(
//         inputValue.email,
//         inputValue.password
//       )
//       if (response.ok) {
//         const data = await response.json()
//         dispatch(
//           setUser({
//             access: data.access,
//             refresh: data.refresh,
//           })
//         )
//         navigation('/')
//       } else {
//         const data = await response.json()
//         setError({
//           non_field_errors: ['Проверьте правильность введенных данных!'],
//         })
//       }
//     } catch (error) {
//       console.log(error)
//     }
//     setInputValue(initialState)
//   }
//   return (
//     <>
//       <div className={styles.login}>
//         <div className={styles.container}>
//           <div className={activeBlur ? styles.blurContainer : ' '}></div>
//           <div className={styles.block}>
//           <img src={logo} alt='логотип'></img>
//           <form
//             onSubmit={(e) => onSubmitHandler(e)}
//             className={styles.form}
//             action=""
//           >
//             <InputField
//               name={'email'}
//               onChangeHandler={onChangeHandler}
//               placeholder={'Электронный адрес'}
//               isNone
//               isAuthForm
//               value={inputValue.email}
//               error={error.non_field_errors}
//               setActiveBlur={setActiveBlur}
//             />
//             <InputField
//               name={'password'}
//               onChangeHandler={onChangeHandler}
//               type={'password'}
//               placeholder={'Пароль'}
//               isAuthForm
//               value={inputValue.password}
//               setActiveBlur={setActiveBlur}
//             />
//             {wrongPassord && (
//               <div className={styles.wrongPass}>
//                 <img src={danger} alt="" />
//                 <span>Пароль введен неверно</span>
//               </div>
//             )}
//             <button className={styles.authButton}>Войти</button>
//           </form>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
