import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";


export const photoLineList = async (access) => {
    const url = `${localUrl}/api/v1/photo/photo_line/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
    });
    return response;
}

export const fetchPhotoLineListWithTokenInterceptor = async (access, refresh) => {
    try {
        let response = await photoLineList(access)
        if (!response.ok) {
            localStorage.setItem('access','');
            let createToken = await tokenRefreshCreate(refresh)
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = photoLineList(res.access);
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