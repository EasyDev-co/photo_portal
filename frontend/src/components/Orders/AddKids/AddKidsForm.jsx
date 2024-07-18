import { useRef, useState } from 'react';
import styles from './AddKids.module.css'
import { tokenRefreshCreate } from '../../../http/tokenRefreshCreate';
import { setCookie } from '../../../utils/setCookie';
import { addPhotos, setAccessToken } from '../../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getOnePhoto } from '../../../http/getOnePhoto';
import { useClickOutside } from '../../../utils/useClickOutside';

const AddKidsForm = ({ addBlock, isActiveForm, setIsActiveForm }) => {

    const addPhoto = useSelector(state => state.user.photos);
    const [error,setError] = useState(false);
    const photosLine = useSelector(state => state.user.photosLine);
    const activeRef = useRef(null);

    useClickOutside(activeRef, () => {
        setIsActiveForm(false)
    })
    const [inputValue, setInputValue] = useState({
        addKids: ''
    });

    const dispatch = useDispatch();

    const onChangeHandler = (event) => {
        const newInput = (data) => ({ ...data, [event.target.name]: event.target.value });
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

        e.preventDefault();
        console.log([...addPhoto, ...photosLine])
        if (compareArrayWithString([...addPhoto, ...photosLine], inputValue.addKids) === true) {
            setInputValue({
                addKids: ''
            });
            setError(true);
            return;
        }

        inputValue.addKids.split(',').forEach(num => {
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
                    getOnePhoto(num, access)
                        .then(res => {
                            if(res.ok){
                                res.json()
                                .then(res=>dispatch(addPhotos(res)))
                                addBlock();
                            } else{
                                setError(true);
                            }
                        })
                        
                })
        });
        setError(false);
        setInputValue({
            addKids: ''
        });


    }

    return (
        <form ref={activeRef} onSubmit={(e) => onSubmitHandler(e)} className={isActiveForm ? styles.addKidsFormActive : styles.addKidsForm} action="">
            <div className={styles.addKidsWrap}>
                <h1 className={styles.profileTitle}>Введите номера фотографий</h1>
                <div>
                    <input onChange={(e) => onChangeHandler(e)} name='addKids' value={inputValue.addKids} className={styles.addKidsInput} type="text" />
                </div>
                {error && 
                    <div className={styles.errorMessage}>
                        Номера фотографий которые вы ввели уже добавлены или не существуют, введите другие номер! 
                    </div>}
            </div>
            <button className={styles.addKidsBtn}>Добавить</button>
        </form>
    );
}

export default AddKidsForm;