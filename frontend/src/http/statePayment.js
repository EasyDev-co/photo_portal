import { localUrl } from "../constants/constants";
import { getCookie, setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./parent/tokenRefreshCreate";

export const statePayment = async (access) => {

    const order = JSON.parse(getCookie('order'));
    
    const url = `${localUrl}/api/v1/get_state/${order.id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        return response;
}

export const fetchStatePaymentTokenInterceptor = async (access, refresh) => {
    try {
        let response = await statePayment(access)
        if (!response.ok) {
            localStorage.setItem('access', '');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = statePayment(res.access);
                        }
                    })
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
};