import styles from '../Registration.module.css';
import InputField from '../../InputField/InputField';
import { useState } from 'react';
import { parentEmailVerification } from '../../../http/parent/parentEmailVerification';
import { useDispatch, useSelector } from 'react-redux';
import { addPhotos, setUser } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { getOnePhoto } from '../../../http/photo/getOnePhoto';
import { patchPhotoLine } from '../../../http/photo/patchPhotoLine';
import { parentRetryEmailCode } from '../../../http/parent/parentRetryEmailCode';

const Verification = () => {
    const initialState = {
        code: '',
        email: ''
    }
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(initialState);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // Для отображения сообщений
    const [isCooldown, setIsCooldown] = useState(false); // Для контроля таймера
    const email = useSelector(action => action.user.email);
    const navigation = useNavigate();
    const photoNumbers = useSelector(action => action.user.photoNumbers);
    const photoLineId = useSelector(action => action.user.photoLineId);
    
    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setInputValue(newInput);
    };
    
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await parentEmailVerification(inputValue.code, email ? email : localStorage.getItem('email'))
            if (response.ok) {
                const data = await response.json();
                dispatch(
                    setUser({
                        access: data.access,
                        refresh: data.refresh
                    })
                )
                getOnePhoto(photoNumbers, data.access)
                    .then(res => {
                        if (res.ok) {
                            res.json()
                                .then(res => {
                                    dispatch(addPhotos(res))
                                    patchPhotoLine(data.access, {
                                        "parent": data.user
                                    }, res.id)
                                })
                        }
                    })
                patchPhotoLine(data.access, {
                    "parent": data.user
                }, photoLineId)
                navigation('/')
            } else {
                const data = await response.json();
                setError(data);
            }
        } catch (error) {
            console.log(error)
        }
        setInputValue(initialState);
    }

    const handleResendCode = async () => {
        setMessage(''); // Сбросить предыдущее сообщение
        setError(null);
        setIsCooldown(true); // Установить таймер
        try {
            const response = await parentRetryEmailCode(email || localStorage.getItem('email'));
            if (response.ok) {
                setMessage('Код успешно отправлен повторно!');
            } else {
                const data = await response.json();
                setError(data.detail || 'Ошибка при отправке кода.');
            }
        } catch (error) {
            setError('Ошибка при отправке кода.');
        } finally {
            setTimeout(() => setIsCooldown(false), 60000); // Разблокировать кнопку через 60 секунд
        }
    };

    return (
        <>
            <div className={styles.login}>
                <div className={styles.container}>
                    <div className={styles.regFormWrap}>
                        <div className={styles.regFormContainer}>
                            <h1 className={styles.formHeader}>Подтверждение регистрации</h1>
                            <form onSubmit={(e) => onSubmitHandler(e)} className={styles.regForm} action="">
                                <label style={{fontSize: '15px'}}>Код отправлен на почту {email}</label>
                                <InputField
                                    name={'code'}
                                    onChangeHandler={onChangeHandler}
                                    type={'text'}
                                    placeholder={'Код'}
                                    isAuthForm
                                    isNone
                                    value={inputValue.code}
                                />

                                <p>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isCooldown} // Блокировать кнопку на время таймера
                                    style={{color: 'rgba(17, 187, 209, 1)', fontSize: '15px'}}
                                >
                                    Отправить код повторно
                                </button>
                            </p>
                            {message && <p style={{ color: 'green', fontSize: '12px' }}>{message}</p>}
                            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                                <button className={styles.authButton}>Продолжить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Verification;