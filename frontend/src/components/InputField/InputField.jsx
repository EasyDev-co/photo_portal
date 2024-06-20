import { useState } from 'react';
import style from './InputField.module.css'

const InputField = ({ placeholder, type, label, name, id, value, isPencil,isMarker,onChangeHandler,inputValue}) => {
    const [activeInput, setIsActiveInput] = useState(false)
    return (
        <div className={style.inputWrap}>
            <label className={style.labelDesc} htmlFor={id}>
                {label}
            </label>
            <div className={style.inputFieldWrap}>
                <input onChange={(e)=>onChangeHandler(e)} className={style.inputField} type={type} placeholder={placeholder} name={name} id={id} value={activeInput?inputValue:value} required/>
                <div onClick={()=>{setIsActiveInput(!activeInput)}} className={isPencil ? style.inputPencil : isMarker && style.inputMarker}></div>
            </div>
        </div>
    );
}

export default InputField;