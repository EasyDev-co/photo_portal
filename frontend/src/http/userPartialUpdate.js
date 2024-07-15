import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const userPartialUpdate = async (acces, obj) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/user/`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
        body: JSON.stringify(obj)
    });
    return response;
}

export const fetchUserPartialUpdateWithTokenInterceptor = async (access, obj, refresh) => {
    try {
        let response = await userPartialUpdate(access, obj)
        console.log(response.ok)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = userPartialUpdate(access, obj);
                    })
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};