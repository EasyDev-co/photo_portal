/* eslint-disable react-hooks/rules-of-hooks */
import { getCookie } from "../utils/setCookie";
import { useAuth } from "../utils/useAuth";
export const addAccessTokenToHeaders = (headers) => {
    const {acces} = useAuth();
  
    if (acces) {
        headers['Authorization'] = `Bearer ${acces}`;
        headers['Content-Type'] = 'application/json';
    }
  
    return headers;
};