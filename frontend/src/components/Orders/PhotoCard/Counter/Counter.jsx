import { useRef, memo, useState, useEffect } from "react";
import styles from './Counter.module.css';
import { useSelector } from "react-redux";

const Counter = ({ blocksId, isChecked, photoLineId, onChangeHandler, name, id, photoId }) => {
    const inputRef = useRef(null);
    const [showBtn, setShowBtn] = useState(false);
    const [count, setCount] = useState(0);
    const [price, setPrice] = useState(0);
    const cart = useSelector(state => state.user.cart);

    // Функция для получения количества из localStorage
    const getCountFromLocalStorage = () => {
        const cartFromLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Находим нужную фотолинию
        const photoLine = cartFromLocalStorage.find(item => item.photo_line_id === photoLineId);
        if (!photoLine) {
            console.log('Фотолиния не найдена в localStorage');
            return 0;
        }

        // Находим нужное фото в фотолинии
        const photo = photoLine.photos.find(photo => photo.id === photoId && photo.photo_type === name);
        if (!photo) {
            console.log('Фото не найдено в фотолинии');
            return 0;
        }

        console.log('Количество фото из localStorage:', photo.quantity);
        return photo.quantity;
    };

    // Обновляем количество при монтировании компонента
    useEffect(() => {
        const initialCount = getCountFromLocalStorage();
        setCount(initialCount);
    }, [photoLineId, photoId, name]);

    // Обновляем общую цену при изменении корзины
    useEffect(() => {
        const sumTotalPrice = cart?.reduce((sum, item) => {
            return sum + parseFloat(item.total_price);
        }, 0);
        setPrice(sumTotalPrice);
    }, [cart]);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        updateLocalStorageCount(newCount);
        const siblingInput = inputRef.current.name;
        if (siblingInput) {
            const siblingValue = siblingInput;
            onChangeHandler(siblingValue, newCount, photoId, isChecked, photoLineId, blocksId);
        }
    };

    const decrement = () => {
        if (count > 0) {
            const newCount = count - 1;
            setCount(newCount);
            updateLocalStorageCount(newCount);
            const siblingInput = inputRef.current.name;
            if (siblingInput) {
                const siblingValue = siblingInput;
                onChangeHandler(siblingValue, newCount, photoId, isChecked, photoLineId, blocksId);
            }
        }
    };

    // Функция для обновления количества в localStorage
    const updateLocalStorageCount = (newCount) => {
        const cartFromLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Находим нужную фотолинию
        const photoLineIndex = cartFromLocalStorage.findIndex(item => item.photo_line_id === photoLineId);
        if (photoLineIndex === -1) {
            console.log('Фотолиния не найдена в localStorage');
            return;
        }

        // Находим нужное фото в фотолинии
        const photoIndex = cartFromLocalStorage[photoLineIndex].photos.findIndex(photo => photo.id === photoId && photo.photo_type === name);
        if (photoIndex === -1) {
            console.log('Фото не найдено в фотолинии');
            return;
        }

        // Обновляем количество
        cartFromLocalStorage[photoLineIndex].photos[photoIndex].quantity = newCount;
        localStorage.setItem('cart', JSON.stringify(cartFromLocalStorage));
        console.log('Количество обновлено в localStorage:', newCount);
    };

    return (
        <div className={styles.counterBlock}>
            <div className={styles.counterName}>{id}</div>
            <div onMouseEnter={() => setShowBtn(true)} onMouseLeave={() => setShowBtn(false)} className={styles.counterButtonWrap}>
                <button className={showBtn ? styles.counterButtonDecShow : styles.counterButtonDec} type="button" onClick={decrement} disabled={count === 0}>-</button>
                <input className={styles.counterInput} ref={inputRef} type="text" name={name} value={count} disabled />
                <button className={showBtn ? styles.counterButtonShow : styles.counterButton} type="button" onClick={increment}>+</button>
            </div>
        </div>
    );
};

export default memo(Counter);


// import { useRef, memo, useState, useEffect } from "react";
// import styles from './Counter.module.css';
// import { useCart } from "../../../../contexts/CartContext";
// import { useSelector } from "react-redux";

// const Counter = ({ blocksId, isChecked, photoLineId, onChangeHandler, name, id, photoId }) => {
//     const { getPhotoCount, updatePhotoCount, updateTotalPrice } = useCart();
//     const count = getPhotoCount(photoId, name); // Загружаем текущее значение для конкретного photoId и name
//     const inputRef = useRef(null);
//     const [showBtn, setShowBtn] = useState(false);

//     const [price, setPrice] = useState(0)
//     const cart = useSelector(state => state.user.cart);

//     useEffect(() => {
//         const sumTotalPrice = cart?.reduce((sum, item) => {
//             return sum + parseFloat(item.total_price);
//         }, 0);
//         updateTotalPrice(sumTotalPrice);
//         setPrice(sumTotalPrice);
//     }, [cart]);

//     const increment = () => {
//         console.log(photoId, name, id)
//         updatePhotoCount(photoId, name, count + 1);
//         const siblingInput = inputRef.current.name;
//         if (siblingInput) {
//             const siblingValue = siblingInput;
//             onChangeHandler(siblingValue, count + 1, photoId, isChecked, photoLineId, blocksId);
//         }
//         // console.log('проверка', price)
//         // updateTotalPrice(price);
//     };

//     const decrement = () => {
//         if (count > 0) {
//             updatePhotoCount(photoId, name, count - 1);
//             const siblingInput = inputRef.current.name;
//             if (siblingInput) {
//                 const siblingValue = siblingInput;
//                 onChangeHandler(siblingValue, count - 1, photoId, isChecked, photoLineId, blocksId);
//             }
//             // console.log('проверка', price)
//             // updateTotalPrice(price);
//         }
//     };

//     return (
//         <div className={styles.counterBlock}>
//             <div className={styles.counterName}>{id}</div>
//             <div onMouseEnter={() => setShowBtn(true)} onMouseLeave={() => setShowBtn(false)} className={styles.counterButtonWrap}>
//                 <button className={showBtn ? styles.counterButtonDecShow : styles.counterButtonDec} type="button" onClick={decrement} disabled={count === 0}>-</button>
//                 <input className={styles.counterInput} ref={inputRef} type="text" name={name} value={count} disabled />
//                 <button className={showBtn ? styles.counterButtonShow : styles.counterButton} type="button" onClick={increment}>+</button>
//             </div>
//         </div>
//     );
// };

// export default Counter;