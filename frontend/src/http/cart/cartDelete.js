
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";


export const cartDelete = async (access, id) => {
    const url = `${localUrl}/api/v1/orders_payment/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },

    });
    return response;
}

export const fetchCartDeleteWithTokenInterceptor = async (access, id, refresh) => {
    try {
        let response = await cartDelete(access, id)
        if (!response.ok) {
            localStorage.setItem('access', '');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = cartDelete(res.access, id);
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