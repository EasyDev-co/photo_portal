import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const getUserData = async (acces) => {
    const url = `http://127.0.0.1:8080/api/v1/user/`;
   
    const response = await fetch(url, {
        headers: {
             'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
    });
    return response;
}

export const fetchUserDataWithTokenInterceptor = async (access) => {
    try {
        let response = await getUserData(access)
        if (response.status === 401 || response.status === 403) {
            await tokenRefreshCreate()
                .then(res => res.json())
                .then(res => {
                    if (res.refresh != undefined) {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = getUserData(res.access);
                    }
                })
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};