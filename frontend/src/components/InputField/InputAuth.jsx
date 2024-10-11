/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
                <div className={activeInput? styles.inputIsShow : ''} onClick={(e) => { clickMarker(e) }}>
                </div>
            </div>
       
    );
}
 
export default InputAuth;