import { localUrl } from "../constants/constants";
import { getCookie, setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const statePayment = async (access) => {

    const order = JSON.parse(getCookie('order'));
    
    for(let i = 0; i < order.length; i += 1){

        const url = `${localUrl}/api/v1/get_state/${order[i].id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        });
        return response;
    }
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
        throw error;
    }
};