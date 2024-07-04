import { useRef, useState } from 'react';
import styles from './AddKids.module.css'
import { tokenRefreshCreate } from '../../../http/tokenRefreshCreate';
import { setCookie } from '../../../utils/setCookie';
import { addPhotos, setAccessToken } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';
import { getOnePhoto } from '../../../http/getOnePhoto';
import { useClickOutside } from '../../../utils/useClickOutside';

const AddKidsForm = ({ addBlock,isActiveForm,setIsActiveForm }) => {
    
    const activeRef = useRef(null);
    useClickOutside(activeRef,()=>{
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

    const onSubmitHandler = async (e) => {
        e.preventDefault();
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
                        .then(res => res.json())
                        .then(res => {
                            dispatch(
                                addPhotos(res)
                            )
                        })
                })
        });
        addBlock();
        setInputValue({
            addKids: ''
        });
    }
    return (
        <form ref={activeRef} onSubmit={onSubmitHandler} className={isActiveForm?styles.addKidsFormActive:styles.addKidsForm} action="">
            <div className={styles.addKidsWrap}>
                <h1 className={styles.profileTitle}>Введите номера фотографий</h1>
                <div>
                    <input onChange={(e) => onChangeHandler(e)} name='addKids' value={inputValue.addKids} className={styles.addKidsInput} type="text" />
                </div>
            </div>
            <button className={styles.addKidsBtn}>Добавить</button>
        </form>
    );
}

export default AddKidsForm;