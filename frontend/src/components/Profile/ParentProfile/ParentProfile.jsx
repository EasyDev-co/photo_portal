import MainButton from "../../Buttons/MainButton";
import ResetPassButton from "../../Buttons/ResetPassButton";
import InputField from "../../InputField/InputField";
import styles from "./ParentProfile.module.css";
import { userInfoProfile } from "../../../constants/constants";
import { useState } from "react";
import { gen_password } from "./utils";
import PaymentTimer from "../../Payment/PaymentTimer/PaymentTimer";
import { Title } from "../../Title/Title";
const ParentProfile = ({ nurseryIsAuth }) => {
    const [inputValue,setInputValue]  = useState({
        parentSurname:'',
        parentName:'',
        parentPatronymic:'',
        parentPhone:'',
        parentEmail:'',
        kindergarten:'',
        parentCity:'',
        parentPass:'',
        parentNewPass:''
    });

    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setInputValue(newInput);
    }
    const onSubmitHandler = (e) =>{
        e.preventDefault();
        console.log(inputValue)
    }
    return (
        <div className={styles.profileWrap}>
            <form onSubmit={(e)=>{onSubmitHandler(e)}} className={styles.profileForm} action="">
            <h1 className={styles.profileTitle}>Личный кабинет</h1>
                <div className={styles.profileInputWrap}>
                    <InputField
                        placeholder={"Фамилия"}
                        label={"Фамилия"}
                        type={"text"}
                        name={"parentSurname"}
                        id={"parentSurname"}
                        value={userInfoProfile.surname}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentSurname}
                    />
                    <InputField
                        placeholder={"Имя"}
                        label={"Имя"}
                        type={"text"}
                        name={"parentName"}
                        id={"parentName"}
                        value={userInfoProfile.name}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentName}
                    />
                    <InputField
                        placeholder={"Отчество"}
                        label={"Отчество"}
                        type={"text"}
                        name={"parentPatronymic"}
                        id={"parentPatronymic"}
                        value={userInfoProfile.patronymic}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentPatronymic}
                    />
                </div>
                <div className={styles.profileInputWrap}>
                    <InputField
                        placeholder={"Телефон"}
                        label={"Телефон"}
                        type={"text"}
                        name={"parentPhone"}
                        id={"parentPhone"}
                        value={userInfoProfile.tel}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentPhone}
                    />
                    <InputField
                        placeholder={"Электронный адрес"}
                        label={"Электронный адрес"}
                        type={"text"}
                        name={"parentEmail"}
                        id={"parentEmail"}
                        value={userInfoProfile.email}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentEmail}
                    />

                </div>
                <div className={styles.profileInputWrap}>
                    <InputField
                        placeholder={"Город"}
                        label={"Город"}
                        type={"text"}
                        name={"parentCity"}
                        id={"parentCity"}
                        value={userInfoProfile.city}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentCity}
                    />
                    <InputField
                        placeholder={"Сад"}
                        label={"Сад"}
                        type={"text"}
                        name={"kindergarten"}
                        id={"kindergarten"}
                        value={userInfoProfile.kindergarten}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.kindergarten}
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
                        value={userInfoProfile.password}
                        isMarker
                        onChangeHandler={onChangeHandler}
                        inputValue={inputValue.parentPass}
                    />
                    <InputField
                        placeholder={"Новый пароль"}
                        label={"Новый пароль"}
                        type={"text"}
                        name={"parentNewPass"}
                        id={"parentNewPass"}
                        isPencil
                        onChangeHandler={onChangeHandler}
                        value={gen_password(12)}
                        inputValue={inputValue.parentNewPass}
                    />
                    <ResetPassButton
                        value={"Восстановить пароль"}
                    />
                </div>
                <MainButton
                    value={"Сохранить"}
                />
            </form>
            <PaymentTimer/>
        </div>
    );
}

export default ParentProfile;