import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";


export const getUserData = async (acces) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/user/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        signal
    });
    return response;
}

export const fetchUserDataWithTokenInterceptor = async (access, refresh) => {
    try {
        let response = await getUserData(access)
        if (!response.ok) {
            localStorage.setItem('access','');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = getUserData(res.access);
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