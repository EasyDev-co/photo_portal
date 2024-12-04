import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [photoCounts, setPhotoCounts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

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

    return (
        <CartContext.Provider value={{ photoCounts, updatePhotoCount, getPhotoCount, totalPrice, updateTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};
