import styles from '../Registration.module.css'
import { useState } from "react";
import InputField from "../../InputField/InputField";
import { Link } from 'react-router-dom';
import { parentResetPassCreate } from '../../../http/parentResetPassCreate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { parentVerifyResetCode } from '../../../http/parentVerifyResetCode';
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
          setOnReset(true);
          console.log(data)
      
        } else {
          const data = await response.json();
          console.log(data)
        }
      } catch (error) {

      }
    }
    if (onReset) {
      try {
        const response = await parentVerifyResetCode(email, inputValue.resetCode)
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          navigation('/password-reset/new-password');
          dispatch(
            setCode({
              code: inputValue.resetCode
            })
          )
          setInputValue({ resetEmail: '', resetCode: '' });
        } else {
          const data = await response.json();
          console.log(data)
        }
      } catch (error) {

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
                {onReset ?
                  <InputField
                    name={'resetCode'}
                    onChangeHandler={onChangeHandler}
                    type={'text'}
                    placeholder={'Код'}
                    isAuthForm
                    isNone
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