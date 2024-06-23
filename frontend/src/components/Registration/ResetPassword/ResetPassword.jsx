import styles from '../Registration.module.css'
import { useState } from "react";
import InputField from "../../InputField/InputField";
import { Link } from 'react-router-dom';

const ResetPassword = () => {

  const [inputValue, setInputValue] = useState({
    resetEmail: '',
    resetCode: ''
  });
  const [onReset, setOnReset] = useState(false)
  const onChangeHandler = (event) => {
    const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
    setInputValue(newInput);
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(inputValue)
  }
  const sendToResetPass = () => {
    setTimeout(() => {
      setOnReset(!onReset)
    }, 1000)

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
                {onReset ?
                 <Link to={'/password-reset/new-password'} className={styles.authButton}>Продолжить</Link> :
                  <button onClick={() => sendToResetPass()} className={styles.authButton}>Продолжить</button>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;