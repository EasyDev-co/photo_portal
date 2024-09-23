import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";


export const cartCreate = async (access, cart) => {
    const url = `${localUrl}/api/v1/cart/`;
    const response = await fetch(url,{
        method:'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(cart),
    });
    return response;
}

export const fetchCartCreateWithTokenInterceptor = async (access, refresh ,cart) => {
    try {
        let response = await cartCreate(access, cart)
        if (!response.ok) {
            // localStorage.setItem('access','');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = cartCreate(res.access, cart);
                        }
                    })
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};