/* eslint-disable react-hooks/rules-of-hooks */
import styles from './PhotoCard.module.css'
import Counter from './Counter/Counter';
import { useState, useRef, useEffect, memo } from 'react';
import { useClickOutside } from '../../../utils/useClickOutside';

const PhotoCard = memo(({blocksId, isChecked, photoLineId, onChangeHandler, inputValue, onSubmitHandler, number, photo, setIsBlur, blurRef, getChangeData, photoId }) => {
    const [isScale, setIsScale] = useState(false);
    const [count, setCount] = useState(0);

    const scaleRef = useRef(null);

    useClickOutside(scaleRef, () => {
        if(isScale){
            setIsScale(false);
        }
    })
    const onScaleHandler = () => {
        setIsBlur(true)
        setIsScale(true);
    }
    const increment = () => {
        setIsBlur(true)
        if (count < 360) {
            setCount(prevCount => prevCount + 90);
        }
    };
    const decrement = () => {
        setIsBlur(true)
        if (count > 0) {
            setCount(prevCount => prevCount - 90);
        }
    };

    return (
        <div ref={blurRef}  className={styles.photoCardWrap}>
            <div ref={scaleRef} onClick={()=>{isScale && setIsBlur(true)}} className={isScale ? styles.imgWrapScale : styles.imgWrap}>
                <img  style={isScale ? { transform: `rotateZ(${count}deg)` } : { transform: `rotateZ(${0}deg)` }} className={styles.cardImg} src={photo} alt="" />
                <div onClick={() =>onScaleHandler()} className={styles.loupe}></div>
                <div className={isScale ? styles.rotateWrap : styles.dNone}>
                    <div onClick={() => decrement()} className={styles.rotateLeft}></div>
                    <div onClick={() => increment()} className={styles.rotateRight}></div>
                </div>
            </div>
            <form id={number} className={styles.photoCountersCardsWrapper}>
                <Counter
                    blocksId={blocksId}
                    photoLineId={photoLineId}
                    isChecked={isChecked}
                    photoId={photoId}
                    number={number}
                    name={1}
                    id={'10x15'}
                    inputValue={inputValue["10x15"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                blocksId={blocksId}
                    photoLineId={photoLineId}
                    isChecked={isChecked}
                    photoId={photoId}
                    number={number}
                    name={2}
                    id={'15x20'}
                    inputValue={inputValue["15x20"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                blocksId={blocksId}
                    photoLineId={photoLineId}
                    isChecked={isChecked}
                    photoId={photoId}
                    number={number}
                    name={3}
                    id={'20x30'}
                    inputValue={inputValue["20x30"]}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                blocksId={blocksId}
                    photoLineId={photoLineId}
                    isChecked={isChecked}
                    photoId={photoId}
                    number={number}
                    name={4}
                    id={'Магнит'}
                    inputValue={inputValue.magnet}
                    onChangeHandler={onChangeHandler}
                />
                <Counter
                blocksId={blocksId}
                    photoLineId={photoLineId}
                    isChecked={isChecked}
                    photoId={photoId}
                    number={number}
                    name={5}
                    id={'Календарь'}
                    inputValue={inputValue.calendar}
                    onChangeHandler={onChangeHandler}
                />
            </form>
            <div style={styles.photoNumber}>Фото № {number}</div>
        </div>
    );
})

export default PhotoCard;