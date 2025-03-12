import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [photoCounts, setPhotoCounts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    // useEffect(() => {console.log('totalPrice in context:', totalPrice)}, [totalPrice]);
    // useEffect(() => {console.log('photoCounts in context:', photoCounts)}, [photoCounts]);

    const updatePhotoCount = (photoId, name, count) => {
        setPhotoCounts(prev => ({
            ...prev,
            [photoId]: {
                ...prev[photoId],
                [name]: count,
            },
        }));
    };

    const getPhotoCount = (photoId, name) => {
        return (photoCounts[photoId] && photoCounts[photoId][name]) || 0;
    };

    const updateTotalPrice = (newPrice) => {
        setTotalPrice(newPrice);
    };

    // const getTotalPrice = () => {
    //     return totalPrice;
    // };

    return (
        <CartContext.Provider value={{ photoCounts, updatePhotoCount, getPhotoCount, totalPrice, updateTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
