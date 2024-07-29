import MainButton from "../../Buttons/MainButton";
import ResetPassButton from "../../Buttons/ResetPassButton";
import InputField from "../../InputField/InputField";
import styles from "./ParentProfile.module.css";
import { useRef, useState } from "react";
import { gen_password } from "./utils";
import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setResetData, addUserData } from "../../../store/authSlice";
import { parentResetPassCreate } from "../../../http/parentResetPassCreate";
import { useClickOutside } from "../../../utils/useClickOutside";
import { parentVerifyResetCode } from "../../../http/parentVerifyResetCode";
import { parentChangePass } from "../../../http/parentChangePass";

import { fetchUserPartialUpdateWithTokenInterceptor } from '../../../http/userPartialUpdate'
const ParentProfile = ({ nurseryIsAuth }) => {

    const [codeWindowActive, setCodeWindow] = useState(false)
    const codeRef = useRef(null)
    useClickOutside(codeRef, () => {
        setCodeWindow(false)
    })
    const [error, setError] = useState({
        phone_number: '',
        message: '',
        email: ''
    });
    const [resetPassActive, setResetActive] = useState(false);
    const [generatePass, setPass] = useState(gen_password(12));
    const [activeBlur, setActiveBlur] = useState(true)
    // const userData = useSelector(state => state.user.userData);
    const accessStor = localStorage.getItem('access');
    const [inputValue, setInputValue] = useState({
        parentSurname: localStorage.getItem('last_name') || '',
        parentName: localStorage.getItem('first_name') || '',
        parentPatronymic: localStorage.getItem('second_name') || '',
        parentPhone: localStorage.getItem('phone') || '',
        parentEmail: localStorage.getItem('email') || '',
        kindergarten: localStorage.getItem('kindergarten') || '',
        parentCity: localStorage.getItem('regionName') || '',
        parentPass: '',
        parentNewPass: generatePass,
        resetEmail: ''
    });

    const [inputValueReset, setResetValue] = useState({
        code: ''
    });

    const dispatch = useDispatch();
    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setInputValue(newInput);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        fetchUserPartialUpdateWithTokenInterceptor(accessStor, {
            email: inputValue.parentEmail,
            first_name: inputValue.parentName,
            second_name: inputValue.second_name,
            last_name: inputValue.parentSurname,
            phone_number: inputValue.parentPhone
        })
            .then(res => {
                if (!res.ok) {
                    res.json()
                        .then(res => {
                            setError(res)
                        })

                } else {
                    res.json()
                        .then(res => {
                            setError({
                                phone_number: '',
                                message: '',
                                email: ''
                            })
                        })
                }
            })

    }

    const onSubmitToReset = (e) => {
        e.preventDefault()
        if (resetPassActive) {
            parentResetPassCreate(inputValue.resetEmail)
                .then(res => {
                    if (res.ok) {
                        res.json()
                            .then(res => {
                                if (resetPassActive) {
                                    setError(prev => ({ ...prev, ['email']: '' }))
                                    setCodeWindow(true)
                                }
                                dispatch(setResetData({
                                    emailForReset: inputValue.resetEmail,
                                    newPass: inputValue.parentNewPass
                                }))
                            })
                    } else {
                        res.json()
                            .then(res => {
                                setError(prev => ({ ...prev, ['email']: res.email }))
                            })
                    }
                })

        }
    }
    const resetDataUser = useSelector(state => state.user.resetDataUser);
    const onResetSubmit = (e) => {
        e.preventDefault();
        parentVerifyResetCode(resetDataUser.emailForReset, inputValueReset.code)
            .then(res => res.json())
            .then(res => {
                if (res.message === 'Код верифицирован. Можете сменить пароль.') {
                    parentChangePass(inputValueReset.code, resetDataUser.emailForReset, resetDataUser.newPass)
                        .then(res => res.json())
                        .then(res => {
                            if (res) {
                                setCodeWindow(false)
                            }
                        })
                        .catch(res => {
                            console.log(res)
                            setCodeWindow(false)
                        })
                }
            })
    }

    const onChangeReset = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setResetValue(newInput);
    }

    return (
        <div className={styles.profileWrap}>
            <div className={styles.profileFormsWrap}>
                {codeWindowActive &&
                    <form onSubmit={(e) => onResetSubmit(e)} className={styles.codeResetForm} action="">
                        <div onClick={()=>setCodeWindow(false)} className={styles.closeBtn}></div>
                        <div className={styles.codeResetWrap}>
                            <InputField
                                label={"Введите код отправленный на Email"}
                                placeholder={"Код"}
                                type={"text"}
                                name={"code"}
                                id={"parentSurname"}
                                value={inputValueReset.code}
                                onChangeHandler={onChangeReset}
                                isNone
                                setActiveBlur={setActiveBlur}
                            />
                            <MainButton
                                value={"Отправить код"}
                            />
                        </div>
                    </form>}
                <form onSubmit={(e) => { onSubmitHandler(e) }} className={styles.profileForm} action="">
                    <h1 className={styles.profileTitle}>Личный кабинет</h1>
                    <div className={styles.profileInputWrap}>
                        <InputField
                            placeholder={"Фамилия"}
                            label={"Фамилия"}
                            type={"text"}
                            name={"parentSurname"}
                            id={"parentSurname"}
                            value={inputValue.parentSurname}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            setActiveBlur={setActiveBlur}
                        />
                        <InputField
                            placeholder={"Имя"}
                            label={"Имя"}
                            type={"text"}
                            name={"parentName"}
                            id={"parentName"}
                            value={inputValue.parentName}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            setActiveBlur={setActiveBlur}
                        />
                        <InputField
                            placeholder={"Отчество"}
                            label={"Отчество"}
                            type={"text"}
                            name={"parentPatronymic"}
                            id={"parentPatronymic"}
                            value={inputValue.parentPatronymic}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            setActiveBlur={setActiveBlur}
                        />
                    </div>
                    <div className={styles.profileInputWrap}>
                        <InputField
                            placeholder={"+7"}
                            label={"Телефон"}
                            type={"text"}
                            name={"parentPhone"}
                            id={"parentPhone"}
                            value={inputValue.parentPhone}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            error={error.phone_number}
                            setActiveBlur={setActiveBlur}
                        />
                        <InputField
                            placeholder={"mail@mail.ru"}
                            label={"Электронный адрес"}
                            type={"text"}
                            name={"parentEmail"}
                            id={"parentEmail"}
                            value={inputValue.parentEmail}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            error={error.message ? [error.message] : error.message}
                            setActiveBlur={setActiveBlur}
                        />

                    </div>
                    <div className={styles.profileInputWrap}>
                        <InputField
                            placeholder={"Город"}
                            label={"Город"}
                            type={"text"}
                            name={"parentCity"}
                            id={"parentCity"}
                            value={inputValue.parentCity}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            setActiveBlur={setActiveBlur}
                        />
                        <InputField
                            placeholder={"Детский сад “Ромашка”"}
                            label={"Сад"}
                            type={"text"}
                            name={"kindergarten"}
                            id={"kindergarten"}
                            value={inputValue.kindergarten}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            setActiveBlur={setActiveBlur}
                        />

                    </div>
                    <MainButton
                        value={"Сохранить"}
                    />
                    {!nurseryIsAuth && <div className={styles.parentPromotion}>
                        <p>
                            <span>
                                Активный родитель!
                            </span>
                            Мы не работаем в вашем детском саду и предлагаем вам продвинуть наши услуги в вашем детском саду. За это вы получите 90% скидку, как активный родитель. Если вам удасться продвинуть нас свяжитесь с нами по почте @…. и мы выдадим вам уникальный промокод со скидкой
                        </p>
                    </div>
                    }
                </form>
                <form className={styles.formReset} onSubmit={(e) => onSubmitToReset(e)} action="">
                    <div className={styles.profileInputWrap}>
                        <InputField
                            placeholder={"Старый пароль"}
                            label={"Старый пароль"}
                            type={"password"}
                            name={"parentPass"}
                            id={"parentPass"}
                            value={inputValue.parentPass}
                            onChangeHandler={onChangeHandler}
                            autocomplete
                            setActiveBlur={setActiveBlur}
                        />
                        <InputField
                            placeholder={generatePass}
                            label={"Новый пароль"}
                            type={"text"}
                            name={"parentNewPass"}
                            id={"parentNewPass"}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            value={inputValue.parentNewPass}
                            setActiveBlur={setActiveBlur}
                        />
                        {resetPassActive ? <InputField
                            placeholder={'mail@mail.ru'}
                            label={"Введите Email для изменения пароля"}
                            type={"text"}
                            name={"resetEmail"}
                            id={"resetEmail"}
                            isPencil
                            onChangeHandler={onChangeHandler}
                            value={inputValue.resetEmail}
                            error={error.email}
                            setActiveBlur={setActiveBlur}
                        /> :
                            <ResetPassButton
                                setCodeWindow={setCodeWindow}
                                setResetActive={setResetActive}
                                value={'Укажите Email'}
                            />
                        }
                    </div>
                    <div>
                        <MainButton
                            value={"Отправить код для смены пароля"}
                        />
                    </div>
                </form>
            </div>
            <PaymentTimer
                count={'3 500'} />
        </div>
    );
}

export default ParentProfile;