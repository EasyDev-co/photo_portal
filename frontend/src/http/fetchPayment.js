import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const paymentCreate = async (access, id) => {
    const url = `${localUrl}/api/v1/payment/${id}`;

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

export const fetchPaymentCreateTokenInterceptor = async (access, refresh, id) => {
    try {
        let response = await paymentCreate(access, id)
        if (!response.ok) {
            localStorage.setItem('access', '');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = paymentCreate(res.access, id);
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