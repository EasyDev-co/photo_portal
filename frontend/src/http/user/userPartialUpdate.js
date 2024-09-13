import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const userPartialUpdate = async (access, obj) => {
    const url = `${localUrl}/api/v1/user/`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(obj)
    });
    return response;
}

export const fetchUserPartialUpdateWithTokenInterceptor = async (access, obj) => {
    try {
        let response = await userPartialUpdate(access, obj)
   
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