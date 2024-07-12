import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const userPartialUpdate = async (acces, obj) => {
    const url = `http://127.0.0.1:8080/api/v1/user/`;
   
    const response = await fetch(url, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
        body: JSON.stringify(obj)
    });
    return response;
}

export const fetchUserPartialUpdateWithTokenInterceptor = async (access, obj) => {
    try {
        let response = await userPartialUpdate(access, obj)
        console.log(response)
        if (response.status === 400 || response.status === 401 || response.status === 403) {
            await tokenRefreshCreate()
                .then(res => res.json())
                .then(res => {
                    if (res.refresh !== undefined) {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = userPartialUpdate(access, obj);
                    }
                })
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};