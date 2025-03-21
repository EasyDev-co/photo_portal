import { memo, useRef, useState } from 'react';
import styles from './AddKids.module.css'
import { tokenRefreshCreate } from '../../../http/parent/tokenRefreshCreate';
import { setCookie } from '../../../utils/setCookie';
import { addPhotos, setAccessToken } from '../../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getOnePhoto } from '../../../http/photo/getOnePhoto';
import { useClickOutside } from '../../../utils/useClickOutside';
import { patchPhotoLine } from '../../../http/photo/patchPhotoLine';

const AddKidsForm = ({ addBlock, isActiveForm, setIsActiveForm, setModalActive, setModalText }) => {

    const addPhoto = useSelector(state => state.user.photos);
    const [error, setError] = useState(false);
    const photosLine = useSelector(state => state.user.photosLine);
    const activeRef = useRef(null);
    const idP = localStorage.getItem('idP');

    useClickOutside(activeRef, () => {
        setIsActiveForm(false)
    })
    const [inputValue, setInputValue] = useState({
        addKids: ''
    });

    const dispatch = useDispatch();

    const onChangeHandler = (event) => {
        const inputValue = event.target.value;
        const newInput = (data) => ({ ...data, [event.target.name]: inputValue });
        setInputValue(newInput);
    }

    function compareArrayWithString(array, str) {
        const strArray = str.split(',').map(Number);

        for (let i = 0; i < array.length; i++) {
            if (strArray.includes(array[i].number)) {
                return true;
            }
        }
    }

    const onSubmitHandler = async (e) => {
        const arr = inputValue.addKids.
        split(/[и\s\-.;,]+|jpg|jpeg/i).map(Number)
        .filter(Boolean)
        .map(Number)
        .filter(num => !isNaN(num));
        e.preventDefault();
        const regex = /^\d+(\.jpeg|\.jpg)?([и\s\-.;,]+(\d+(\.jpeg|\.jpg)?)){0,5}([и\s\-.;,]+)?$/i;
        // Проверяем соответствие значения регулярному выражению
        if (regex.test(inputValue.addKids)) {
            setError("");
            if (compareArrayWithString([...addPhoto, ...photosLine], inputValue.addKids) === true) {
                setInputValue({
                    addKids: ''
                });
                setError(true);
                return;
            }
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
                    getOnePhoto(arr, access)
                        .then(res => {
                            if (res.ok) {
                                res.json()
                                    .then(res => {
                                        dispatch(addPhotos(res))
                                        patchPhotoLine(access, {
                                            "parent": idP
                                        }, res.id)

                                    })
                            } else {
                                setError('Номера фотографий которые вы ввели уже добавлены или не существуют, введите другие номер!');
                                res.json()
                                    .then(res => {
                                        console.log(res)
                                        setModalActive(true)
                                        setModalText(
                                        < p >
                                            Вы превысили лимит добавления детей.Если у вас четверо детей, то напишите нам на
                                            < span > fotodetstvo1@yandex.ru </span >
                                            и мы проверим информацию
                                        </p >)
                                    })
                            }
                        })
                    setError('');
                })
            setInputValue({
                addKids: ''
            });
            setIsActiveForm(false)
        } else {
            setError("Неправильный формат ввода. " +
                "Введите 1 или 6 номеров фото через дефис, пробел, запятую или ' и '.")
        }

    }

    return (
        <form ref={activeRef} onSubmit={(e) => onSubmitHandler(e)} className={isActiveForm ? styles.addKidsFormActive : styles.addKidsForm} action="">
            <div className={styles.addKidsWrap}>
                <h1 className={styles.profileTitle}>Введите номера фотографий</h1>
                <div>
                    <input onChange={(e) => onChangeHandler(e)} name='addKids' value={inputValue.addKids} className={styles.addKidsInput} type="text" />
                </div>
                {!!error &&
                    <div className={styles.errorMessage}>
                        {error}
                    </div>}
            </div>
            <button className={styles.addKidsBtn}>Добавить</button>
        </form>
    );
}

export default AddKidsForm;
