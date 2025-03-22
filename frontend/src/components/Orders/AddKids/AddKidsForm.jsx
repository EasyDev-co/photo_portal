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
        // Получаем массив номеров фотографий из введенной строки
        const arr = inputValue.addKids
            .split(/[и\s\-.;,]+|jpg|jpeg/i)
            .map(Number)
            .filter(Boolean)
            .map(Number)
            .filter(num => !isNaN(num));

        e.preventDefault();

        // Регулярное выражение для проверки формата ввода
        const regex = /^\d+(\.jpeg|\.jpg)?([и\s\-.;,]+(\d+(\.jpeg|\.jpg)?)){0,5}([и\s\-.;,]+)?$/i;

        // Если больше 6 номеров — выводим ошибку
        if (arr.length > 6) {
            setError("Вы добавили номера кадров двух детей. Пожалуйста, укажите номера только одного ребёнка.");
            return;
        }

        if (regex.test(inputValue.addKids)) {
            setError("");  // Очистка ошибки при корректном формате

            // Проверяем, если фотографии уже добавлены
            if (arr.every(item => [...addPhoto, ...photosLine].some(photo => photo.number === item))) {
                setInputValue({ addKids: '' });
                setError("Фотографии уже добавлены.");
                return; // Останавливаем дальнейшее выполнение, чтобы не закрылась форма
            }

            // Получаем обновленный токен и делаем запрос на добавление фотографий
            try {
                const res = await tokenRefreshCreate();
                const data = await res.json();
                if (data.refresh) {
                    setCookie('refresh', data.refresh);
                    dispatch(setAccessToken(data.access));
                }

                const access = data.access;
                const photoRes = await getOnePhoto(arr, access);
                const photoData = await photoRes.json();

                if (photoRes.ok) {
                    dispatch(addPhotos(photoData));
                    patchPhotoLine(access, { "parent": idP }, photoData.id);
                    setError('');
                    setInputValue({ addKids: '' });
                    setIsActiveForm(false);
                } else {
                    if (photoData.message && photoData.message.includes("Вы достигли лимита")) {
                        setIsActiveForm(false);
                        setModalActive(true);
                        setModalText(
                            <p>
                                Вы превысили лимит добавления детей. Если у вас четверо детей, то напишите нам на
                                <span> fotodetstvo1@yandex.ru </span>
                                и мы проверим информацию.
                            </p>
                        );
                    } else {
                        setError(photoData.message || 'Номера фотографий которые вы ввели уже добавлены или не существуют, введите другие номера!');
                    }
                }
            } catch (err) {
                console.error('Ошибка:', err);
                setError('Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.');
            }
        } else {
            setError("Введены недопустимые символы. Пожалуйста, используйте только цифры, дефисы (-), запятые (,) или пробелы. Если вы укажите только один номер кадра, будут подтянуты все номера кадров этого ребенка.");
        }
    };

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
