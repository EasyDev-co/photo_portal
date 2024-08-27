import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./parent/tokenRefreshCreate";

export const paymentCreate = async (access, order) => {

    const orderParse = JSON.parse(order);

    const url = `${localUrl}/api/v1/payment/${orderParse.id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}

export const fetchPaymentCreateTokenInterceptor = async (access, refresh, order) => {
    try {
        let response = await paymentCreate(access, order)
        if (!response.ok) {
            localStorage.setItem('access', '');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = paymentCreate(res.access, order);
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