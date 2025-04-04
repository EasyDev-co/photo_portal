import styles from '../Registration.module.css'
import { useState } from "react";
import InputField from "../../InputField/InputField";
import { parentResetPassCreate } from '../../../http/parent/parentResetPassCreate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { parentVerifyResetCode } from '../../../http/parent/parentVerifyResetCode';
import { setEmail, setCode } from '../../../store/authSlice';

const ResetPassword = () => {
  const navigation = useNavigate();

  const [inputValue, setInputValue] = useState({
    resetEmail: '',
    resetCode: ''
  });
  const [onReset, setOnReset] = useState(false);
  const dispatch = useDispatch();
  const email = useSelector(action => action.user.email);
  const [error, setError] = useState({
    email: '',
    message: '',
    detail: ''
  });

  const onChangeHandler = (event) => {
    const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
    setInputValue(newInput);
  }

  const onSubmitHandler = async (e) => {

    e.preventDefault();
    setInputValue({ resetEmail: '', resetCode: '' });
    if (!onReset) {
      dispatch(
        setEmail({
          email: inputValue.resetEmail
        })
      )
      try {
        const response = await parentResetPassCreate(inputValue.resetEmail)
        if (response.ok) {
          const data = await response.json();
          dispatch(
            setEmail(inputValue.resetEmail)
          )
          localStorage.setItem('onReset', 'true')
          setOnReset(true);
          console.log(data)

        } else {
          const data = await response.json();
          setError(data)
          localStorage.setItem('onReset', 'false')
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (onReset) {
      try {
        const response = await parentVerifyResetCode(email, inputValue.resetCode)
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('onReset', 'false')
          navigation('/password-reset/new-password');
          dispatch(
            setCode({
              code: inputValue.resetCode
            })
          )
          setInputValue({ resetEmail: '', resetCode: '' });
        } else {
          const data = await response.json();
          setError(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <div className={styles.login}>
        <div className={styles.container}>
          <div className={styles.regFormWrap}>
            <div className={styles.regFormContainer}>
              <h1 className={styles.formHeader}>Восстановление пароля</h1>
              <form onSubmit={(e) => onSubmitHandler(e)} className={styles.regForm} action="">
                {localStorage.getItem('onReset') === 'true' ?
                  <InputField
                    name={'resetCode'}
                    onChangeHandler={onChangeHandler}
                    type={'text'}
                    placeholder={'Код'}
                    isAuthForm
                    isNone
                    error={error.message ? [error.message] : error.message}
                    value={inputValue.resetCode}
                  /> :
                  <InputField
                    name={'resetEmail'}
                    onChangeHandler={onChangeHandler}
                    type={'text'}
                    placeholder={'Электронный адрес'}
                    isAuthForm
                    isNone
                    value={inputValue.resetEmail}
                    error={error.email ? [error.email] : error.email ? [error.detail] : error.detail ? [error.detail] : error.detail}
                  />
                }
                <button className={styles.authButton}>Продолжить</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;