import styles from '../Registration.module.css'
import { useState } from "react";
import InputField from "../../InputField/InputField";

const NewPassword = () => {
    const [inputValue, setInputValue] = useState({
        newPassword: '',
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

                                <InputField
                                    name={'newPassword'}
                                    onChangeHandler={onChangeHandler}
                                    type={'text'}
                                    placeholder={'Новый пароль'}
                                    isAuthForm
                                    isNone
                                    value={inputValue.newPassword}
                                />
                                <InputField
                                    name={'repeatNewPass'}
                                    onChangeHandler={onChangeHandler}
                                    type={'text'}
                                    placeholder={'Подтвердите новый пароль'}
                                    isAuthForm
                                    isNone
                                    value={inputValue.repeatNewPass}
                                />
                                <button onClick={() => sendToResetPass()} className={styles.authButton}>Продолжить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPassword;