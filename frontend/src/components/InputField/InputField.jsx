/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useRef } from 'react';
import style from './InputField.module.css'
import { useClickOutside } from '../../utils/useClickOutside';
import Prompt from '../Registration/Prompt/Prompt';
import danger from '../../assets/images/Auth/DangerCircle.svg'

const InputField = (
    {
        placeholder,
        type,
        label,
        name,
        id,
        blurRef,
        value,
        isPencil,
        isMarker,
        isNone,
        isQuestions,
        setActiveBlur,
        onChangeHandler,
        isAuthForm,
        autocomplete,
        error,
        isBlur,
        isDisabled
    }) => {

    const [activeInput, setIsActiveInput] = useState(false);
    const [activeWidget, setActiveWidget] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [inputChange, setInputChange] = useState(true);

    const inputRef = useRef(null);
    
    const clickMarker = (e) => {
        setIsActiveInput(!activeInput);

        const siblingInput = inputRef.current;
        setActiveBlur(false)
        if (isQuestions) {
            setActiveWidget(!activeWidget)
            setActiveBlur(true);
            const siblingValue = siblingInput.getAttribute('name');
            if (siblingValue === 'gardenCode') {
                setHighlight(true)
            } else {
                setHighlight(false)
            }
        }
        if (isPencil) {
            setInputChange(!inputChange);
        }
    }

    const radioRef = useRef(null);

    useClickOutside(radioRef, () => {
        setActiveWidget(false);
    })
    return (
        <>
            <div className={style.inputWrap}>
                <label className={style.labelDesc} htmlFor={id}>
                    {label}
                </label>
                <div className={isAuthForm ? style.inputFieldWrapAuth : style.inputFieldWrap}>
                    <input
                        onClick={()=>isBlur && setActiveBlur(false)}
                        ref={inputRef}
                        onChange={(e) => onChangeHandler(e)}
                        className={activeWidget ? style.inputQuestionField : style.inputField}
                        type={activeInput ? 'text' : type}
                        placeholder={placeholder}
                        name={name}
                        id={id}
                        value={value}
                        disabled={isPencil && inputChange || isDisabled}
                        required
                        autoComplete={autocomplete && 'off'}
                    />

                    <div
                        onClick={(e) => { clickMarker(e) }}
                        className={isPencil ? style.inputPencil :
                            isMarker ? style.inputMarker :
                                isQuestions ? style.inputQuestion :
                                    isNone ? '' : activeInput ? style.inputMarker : style.inputIsShow}>
                    </div>
                    <div ref={radioRef} className={activeWidget ? style.showWidget : style.hideWidget}>
                        <Prompt
                            blurRef={blurRef}
                            highlight={highlight}
                            activeWidget={activeWidget}
                        />
                    </div>
                    {error &&
                        <div className={style.errBlockWrap}>
                            {error &&
                                error?.map((elem, i) => {
                                    return (
                                        <div key={i} className={style.wrongPass}>
                                            <img src={danger} alt="" />
                                            <span>{elem}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>

        </>

    );
}

export default InputField;