import styles from './InputAuth.module.css'
import { useState } from 'react';
const InputAuth = ({ placeholder, type, label, name, id, value, isPencil, isMarker, isShow, isQuestions, onChangeHandler, inputValue }) => {
    const [activeInput, setIsActiveInput] = useState(false);

    const clickMarker = (e) => {
        setIsActiveInput(!activeInput)
    }
    return ( 
        <div className={styles.inputWrap}>
                <input onChange={(e) => onChangeHandler(e)} className={styles.inputField} type={type} placeholder={placeholder} name={name} id={id} value={activeInput ? inputValue : value} required />
                <div className={activeInput? styles.inputIsSho:'w'} onClick={(e) => { clickMarker(e) }}>
                </div>
            </div>
       
    );
}
 
export default InputAuth;