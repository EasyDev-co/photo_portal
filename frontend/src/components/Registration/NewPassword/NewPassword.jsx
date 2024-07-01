import styles from '../Registration.module.css'
import { useState } from "react";
import InputField from "../../InputField/InputField";
import { parentChangePass } from '../../../http/parentChangePass';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const NewPassword = () => {
    const initialState = {
        newPassword: '',
        repeatNewPass: ''
    }
    const [inputValue, setInputValue] = useState(initialState);
    const [onReset, setOnReset] = useState(false);
    const email = useSelector(action => action.user.email);
    const code = useSelector(action => action.user.code);
    const navigation = useNavigate();

    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setInputValue(newInput);
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await parentChangePass(code, email, inputValue.newPassword)
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setInputValue(initialState);
                navigation('/sign-in')
            } else {
                const data = await response.json();
                console.log(data)
            }
        } catch (error) {

        }
        console.log(inputValue)
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
                                <button className={styles.authButton}>Продолжить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NewPassword;