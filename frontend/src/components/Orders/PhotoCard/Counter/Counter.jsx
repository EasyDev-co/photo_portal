import { useState, useRef } from "react";
import styles from './Counter.module.css'

const Counter = ({ onChangeHandler, inputValue, name, id }) => {
    const [count, setCount] = useState(0);
    const inputRef = useRef(null);
    const [showBtn, setShowBtn] = useState(false);
    
    const increment = () => {
        setCount(prevCount => prevCount + 1);
        const siblingInput = inputRef.current.name;
        if (siblingInput) {
            const siblingValue = siblingInput;
            onChangeHandler(siblingValue, count + 1);
        }
    };

    const decrement = () => {
        if (count > 0) {
            setCount(prevCount => prevCount - 1);
            const siblingInput = inputRef.current.name;
            if (siblingInput) {
                const siblingValue = siblingInput;
                onChangeHandler(siblingValue, count - 1);
            }
        }
    };
    
    return (
        <div className={styles.counterBlock}>
            <div className={styles.counterName}>{id}</div>
            <div onMouseEnter={()=>setShowBtn(true)} onMouseLeave={()=>setShowBtn(false)} className={styles.counterButtonWrap}>
                <button className={showBtn?styles.counterButtonDecShow:styles.counterButtonDec} type="button" onClick={decrement} disabled={count === 0}>-</button>
                <input className={styles.counterInput} ref={inputRef} type="text" name={name} value={count} disabled />
                <button className={showBtn?styles.counterButtonShow:styles.counterButton} type="button" onClick={increment}>+</button>
            </div>
        </div>
    );
}

export default Counter;