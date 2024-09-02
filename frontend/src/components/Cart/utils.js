import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function convertDate(dateString) {
    // Create a Date object from the input string
    const date = new Date(dateString);
    
    // Get the date and time components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Format the string in the desired format
    const newDate = `${day}.${month}.${year} в ${hours}:${minutes}`;
    return newDate;
}


export const useOnLeavePage = (path, callback) => {
    const location = useLocation();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (location.pathname === path) {
                callback();
            }
        };

        if (location.pathname !== path) {
            callback();
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [location, path, callback]);
};
