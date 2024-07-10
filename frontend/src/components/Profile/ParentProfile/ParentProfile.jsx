import MainButton from "../../Buttons/MainButton";
import ResetPassButton from "../../Buttons/ResetPassButton";
import InputField from "../../InputField/InputField";
import styles from "./ParentProfile.module.css";
import { userInfoProfile } from "../../../constants/constants";
import { useEffect, useRef, useState } from "react";
import { gen_password } from "./utils";
import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import { useSelector } from "react-redux";
import { tokenRefreshCreate } from "../../../http/tokenRefreshCreate";
import { setCookie } from "../../../utils/setCookie";
import { useDispatch } from "react-redux";
import { setAccessToken, setResetData } from "../../../store/authSlice";
import { userPartialUpdate } from "../../../http/userPartialUpdate";
import { parentResetPassCreate } from "../../../http/parentResetPassCreate";
import { parentEmailVerification } from "../../../http/parentEmailVerification";
import { useClickOutside } from "../../../utils/useClickOutside";

const ParentProfile = ({ nurseryIsAuth }) => {

    const [codeWindowActive, setCodeWindow] = useState(false)
    const codeRef = useRef(null)
    useClickOutside(codeRef, () => {
        setCodeWindow(false)
    })

    const [resetPassActive, setResetActive] = useState(false);
    const [generatePass, setPass] = useState(gen_password(12));

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
        tokenRefreshCreate()
            .then(res => res.json())
            .then(res => {
                if (res.refresh) {
                    setCookie('refresh', res.refresh);
                    dispatch(
                        setAccessToken(res.access)
                    )
                }
                return res.access
            })
            .then(access => {
                userPartialUpdate(access, {
                    email: inputValue.parentEmail,
                    first_name: inputValue.parentName,
                    last_name: inputValue.parentSurname,
                    phone_number: inputValue.parentPhone
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res) {
                            // dispatch(addUserData(res))
                            console.log(res)
                        }
                    })
            })
        if (resetPassActive) {
            parentResetPassCreate(inputValue.resetEmail)
                .then(res => res.json())
                .then(res => {
                    if (res) {
                        console.log(res)
                        if (resetPassActive) {
                            setCodeWindow(true)
                        }
                        dispatch(setResetData({
                            emailForReset: inputValue.resetEmail,
                            newPass: inputValue.parentNewPass
                        }))
                    }
                })
        }

    }
    const resetDataUser = useSelector(state => state.user.resetDataUser);

    const onResetSubmit = (e) => {
        e.preventDefault();
        parentEmailVerification(inputValueReset.code, resetDataUser.emailForReset)
            .then(res => res.json())
            .then(res => {
                if (res) {
                    console.log(res)
                    // dispatch(setResetData({
                    //     emailForReset: inputValue.resetEmail,
                    //     newPass: inputValue.parentNewPass
                    // }))
                }
            })
    }
    
    const onChangeReset = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setResetValue(newInput);
    }

    return (
        <div className={styles.profileWrap}>
            {codeWindowActive &&
                <form ref={codeRef} onSubmit={(e) => onResetSubmit(e)} className={styles.codeResetForm} action="">
                    <div className={styles.codeResetWrap}>
                        <InputField
                            label={"Введите код отпрвленный на Email"}
                            placeholder={"Код"}
                            type={"text"}
                            name={"code"}
                            id={"parentSurname"}
                            value={inputValueReset.code}
                            onChangeHandler={onChangeReset}
                            isNone
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
                    />

                </div>
                {!nurseryIsAuth && <div className={styles.parentPromotion}>
                    <p>
                        <span>
                            Активный родитель!
                        </span>
                        Мы не работаем в вашем детском саду и предлагаем вам продвинуть наши услуги в вашем детском саду. За это вы получите 90% скидку, как активный родитель. Если вам удасться продвинуть нас свяжитесь с нами по почте @…. и мы выдадим вам уникальный промокод со скидкой
                    </p>
                </div>
                }
                <div className={styles.profileInputWrap}>
                    <InputField
                        placeholder={"Старый пароль"}
                        label={"Старый пароль"}
                        type={"password"}
                        name={"parentPass"}
                        id={"parentPass"}
                        value={inputValue.parentPass}
                        isMarker
                        onChangeHandler={onChangeHandler}
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
                    />
                    {resetPassActive ? <InputField
                        placeholder={'mail@mail.ru'}
                        label={"Введите Email для восстановления"}
                        type={"text"}
                        name={"resetEmail"}
                        id={"resetEmail"}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        value={inputValue.resetEmail}
                    /> :
                        <ResetPassButton
                            setCodeWindow={setCodeWindow}
                            setResetActive={setResetActive}
                            value={'Восстановить пароль'}
                        />
                    }
                </div>
                <MainButton
                    value={"Сохранить"}
                />
            </form>
            <PaymentTimer
                count={'3 500'} />
        </div>
    );
}

export default ParentProfile;