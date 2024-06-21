import { useState } from 'react';
import style from './InputField.module.css'

const InputField = ({ placeholder, type, label, name, id, value, isPencil, isMarker, isNone, isQuestions, onChangeHandler, inputValue, isAuthForm }) => {
    const [activeInput, setIsActiveInput] = useState(false);
    const [activeWidget,setActiveWidget] = useState(false)
    const clickMarker = (e) => {
        setIsActiveInput(!activeInput)
        if(isQuestions){
            setActiveWidget(!activeWidget)
        }
    }
    console.log(activeWidget)
    return (
        <div className={style.inputWrap}>
            <label className={style.labelDesc} htmlFor={id}>
                {label}
            </label>
            <div className={isAuthForm ? style.inputFieldWrapAuth : style.inputFieldWrap}>
                <input
                    onChange={(e) => onChangeHandler(e)}
                    className={style.inputField}
                    type={activeInput ? 'text' : type}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    value={activeInput ? inputValue : value}
                    required />
                <div
                    onClick={(e) => { clickMarker(e) }}
                    className={isPencil ? style.inputPencil :
                        isMarker ? style.inputMarker :
                            isQuestions ? style.inputQuestion :
                                isNone ? '' :
                                    activeInput ? style.inputMarker
                                        : style.inputIsShow}>

                </div>
                <div className={activeWidget?style.showWidget:style.hideWidget}>
                        qweqweqweqweqweqw
                </div>
            </div>
        </div>
    );
}

export default InputField;