import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./parent/tokenRefreshCreate";

export const getPaidOrders = async (access) => {
   
    const url = `${localUrl}/api/v1/get_paid_orders/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        // body: JSON.stringify()
    });
    return response;
}

export const fetchGetPaidOrderTokenInterceptor = async (access, refresh) => {
    try {
        let response = await getPaidOrders(access)
        if (!response.ok) {
            localStorage.setItem('access', '');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = getPaidOrders(res.access);
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