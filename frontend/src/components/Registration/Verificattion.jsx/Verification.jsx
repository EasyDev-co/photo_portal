import styles from '../Registration.module.css';
import InputField from '../../InputField/InputField';
import { useState } from 'react';
import { parentEmailVerification } from '../../../http/parentEmailVerification';
import { useDispatch, useSelector } from 'react-redux';
import { addPhotos, setUser } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/useAuth';
import { getOnePhoto } from '../../../http/getOnePhoto';
import { patchPhotoLine } from '../../../http/patchPhotoLine';
const Verification = () => {
    const initialState = {
        code: '',
        email: ''
    }
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(initialState);
    const [error, setError] = useState(null);
    const { isAuth } = useAuth();
    const idP = localStorage.getItem('idP');
    const email = useSelector(action => action.user.email);
    const navigation = useNavigate();
    const photoNumbers = useSelector(action => action.user.photoNumbers);
    const photoLineId = useSelector(action => action.user.photoLineId);
    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
        setInputValue(newInput);
    }
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

        }
        setInputValue(initialState);
    }

    return (
        <>
            <div className={styles.login}>
                <div className={styles.container}>
                    <div className={styles.regFormWrap}>
                        <div className={styles.regFormContainer}>
                            <h1 className={styles.formHeader}>Подтверждение регистрации</h1>
                            <form onSubmit={(e) => onSubmitHandler(e)} className={styles.regForm} action="">
                                <InputField
                                    name={'code'}
                                    onChangeHandler={onChangeHandler}
                                    type={'text'}
                                    placeholder={'Код'}
                                    isAuthForm
                                    isNone
                                    value={inputValue.code}
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

export default Verification;