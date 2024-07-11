/* eslint-disable react-hooks/rules-of-hooks */
import styles from './PhotoCard.module.css'
import Counter from './Counter/Counter';
import { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '../../../utils/useClickOutside';

const PhotoCard = ({ onChangeHandler, inputValue, onSubmitHandler, number, photo, setIsBlur, blurRef }) => {
    const [isScale, setIsScale] = useState(false);
    const [count, setCount] = useState(0);

    const scaleRef = useRef(null);
    
    useClickOutside(scaleRef, () => {
        setIsScale(false);
    })

    const onScaleHandler = () => {
        setIsBlur(true);
        setIsScale(true);
    }

    const increment = () => {
        if (count < 360) {
            setCount(prevCount => prevCount + 90);
        }
    };
    const decrement = () => {
        if (count > 0) {
            setCount(prevCount => prevCount - 90);
        }
    };

    return (
        <div className={styles.photoCardWrap}>
            <div ref={scaleRef} className={isScale ? styles.imgWrapScale : styles.imgWrap}>
                <img style={isScale ? { transform: `rotateZ(${count}deg)` } : { transform: `rotateZ(${0}deg)` }} className={styles.cardImg} src={photo.replace(/(http:\/\/[^/]+)/, '$1:8080')} alt="" />
                <div onClick={() => { onScaleHandler() }} className={styles.loupe}></div>
                <div className={isScale ? styles.rotateWrap : styles.dNone}>
                    <div onClick={() => decrement()} className={styles.rotateLeft}></div>
                    <div onClick={() => increment()} className={styles.rotateRight}></div>
                </div>
            </div>
            <div className={styles.photoCountersCardsWrapper}>
                <Counter
                    name={'10x15'}
                    id={'10x15'}
                    inputValue={inputValue["10x15"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                    name={'15x20'}
                    id={'15x20'}
                    inputValue={inputValue["15x20"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                    name={'20x30'}
                    id={'20x30'}
                    inputValue={inputValue["20x30"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                    name={'magnet'}
                    id={'Магнит'}
                    inputValue={inputValue.magnet}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                    name={'calendar'}
                    id={'Календарь'}
                    inputValue={inputValue.calendar}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                    name={'photo_book'}
                    id={'Фотокнига'}
                    inputValue={inputValue.photo_book}
                    onChangeHandler={onChangeHandler}
                />
            </div>
        </div>
    );
}

export default PhotoCard;