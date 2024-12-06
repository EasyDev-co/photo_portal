/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
import styles from './PhotoCard.module.css'
import Counter from './Counter/Counter';
import { useState, useRef, memo } from 'react';
import { useClickOutside } from '../../../utils/useClickOutside';

const PhotoCard = memo(({ blocksId, isChecked, photoLineId, onChangeHandler, inputValue, number, photo, setIsBlur, photoId }) => {
    const [isScale, setIsScale] = useState(false);
    const [count, setCount] = useState(0);
    const [clickBlocked, setClickBlocked] = useState(false); // Новый флаг для блокировки

    const scaleRef = useRef(null);

    useClickOutside(scaleRef, () => {
        if (isScale) {
            setIsScale(false);
            setIsBlur(false);
            setClickBlocked(true); // Блокируем клики
            setTimeout(() => setClickBlocked(false), 300); // Разблокируем через 300ms
        }
    });

    const onScaleHandler = () => {
        if (clickBlocked) return; // Если заблокировано, ничего не делаем
        setIsBlur(true);
        setIsScale(true);
    };

    const increment = (e) => {
        setIsBlur(true);
        if (count < 360) {
            setCount(prevCount => prevCount + 90);
        }
    };

    const decrement = (e) => {
        setIsBlur(true);
        if (count > 0) {
            setCount(prevCount => prevCount - 90);
        }
    };

    return (
        <div className={styles.photoCardWrap}>
            <div 
                onClick={() => {
                    if (isScale) {
                        setIsBlur(false);
                        setIsScale(false);
                    }
                }} 
                className={isScale ? styles.imgWrapScale : styles.imgWrap}
            >
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        onScaleHandler();
                    }}
                >
                    <img
                        style={isScale ? { transform: `rotateZ(${count}deg)` } : { transform: `rotateZ(${0}deg)` }}
                        className={styles.cardImg}
                        src={photo}
                        alt=""
                    />
                    <div className={styles.loupe}></div>
                    <div ref={scaleRef} className={isScale ? styles.rotateWrap : styles.dNone}>
                        <div onClick={(e) => decrement(e)} className={styles.rotateLeft}></div>
                        <div onClick={(e) => increment(e)} className={styles.rotateRight}></div>
                    </div>
                </div>
            </div>
            <div className={styles.photoNumber}>Фото № {number}</div>
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
        </div>
    );
});

export default PhotoCard;





// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable react/display-name */
// /* eslint-disable react-hooks/rules-of-hooks */
// import styles from './PhotoCard.module.css'
// import Counter from './Counter/Counter';
// import { useState, useRef, memo } from 'react';
// import { useClickOutside } from '../../../utils/useClickOutside';

// const PhotoCard = memo(({blocksId, isChecked, photoLineId, onChangeHandler, inputValue, number, photo, setIsBlur, photoId }) => {
//     const [isScale, setIsScale] = useState(false);
//     const [count, setCount] = useState(0);

//     const scaleRef = useRef(null);

//     useClickOutside(scaleRef, () => {
//         if(isScale){
//             setIsScale(false);
//             setIsBlur(false)
//         }
//     })
//     const onScaleHandler = () => {
//         setIsBlur(true)
//         setIsScale(true);
//     }
//     const increment = () => {
//         setIsBlur(true)
//         if (count < 360) {
//             setCount(prevCount => prevCount + 90);
//         }
//     };
//     const decrement = () => {
//         setIsBlur(true)
//         if (count > 0) {
//             setCount(prevCount => prevCount - 90);
//         }
//     };

//     return (
//         <div className={styles.photoCardWrap}>
//             <div  onClick={()=>{isScale && setIsBlur(true)}} className={isScale ? styles.imgWrapScale : styles.imgWrap}>
//                 <div onClick={() =>onScaleHandler()}>
//                     <img  
//                         style={isScale ? { transform: `rotateZ(${count}deg)` } : { transform: `rotateZ(${0}deg)` }} className={styles.cardImg} 
//                         src={photo} 
//                         alt="" 
//                     />
//                     <div className={styles.loupe}></div>
//                     <div ref={scaleRef} className={isScale ? styles.rotateWrap : styles.dNone}>
//                         <div onClick={() => decrement()} className={styles.rotateLeft}></div>
//                         <div onClick={() => increment()} className={styles.rotateRight}></div>
//                     </div>
//                     </div>
//             </div>
//             <div className={styles.photoNumber}>Фото № {number}</div>
//             <form id={number} className={styles.photoCountersCardsWrapper}>
//                 <Counter
//                     blocksId={blocksId}
//                     photoLineId={photoLineId}
//                     isChecked={isChecked}
//                     photoId={photoId}
//                     number={number}
//                     name={1}
//                     id={'10x15'}
//                     inputValue={inputValue["10x15"]}
//                     onChangeHandler={onChangeHandler}
//                 />
//                 <Counter
//                     blocksId={blocksId}
//                     photoLineId={photoLineId}
//                     isChecked={isChecked}
//                     photoId={photoId}
//                     number={number}
//                     name={2}
//                     id={'15x20'}
//                     inputValue={inputValue["15x20"]}
//                     onChangeHandler={onChangeHandler}
//                 />
//                 <Counter
//                     blocksId={blocksId}
//                     photoLineId={photoLineId}
//                     isChecked={isChecked}
//                     photoId={photoId}
//                     number={number}
//                     name={3}
//                     id={'20x30'}
//                     inputValue={inputValue["20x30"]}
//                     onChangeHandler={onChangeHandler}
//                 />
//                 <Counter
//                     blocksId={blocksId}
//                     photoLineId={photoLineId}
//                     isChecked={isChecked}
//                     photoId={photoId}
//                     number={number}
//                     name={4}
//                     id={'Магнит'}
//                     inputValue={inputValue.magnet}
//                     onChangeHandler={onChangeHandler}
//                 />
//                 <Counter
//                     blocksId={blocksId}
//                     photoLineId={photoLineId}
//                     isChecked={isChecked}
//                     photoId={photoId}
//                     number={number}
//                     name={5}
//                     id={'Календарь'}
//                     inputValue={inputValue.calendar}
//                     onChangeHandler={onChangeHandler}
//                 />
//             </form>
//         </div>
//     );
// })

// export default PhotoCard;