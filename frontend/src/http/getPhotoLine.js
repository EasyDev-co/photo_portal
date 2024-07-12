import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const getPhotoLine = async (id, access) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/photo/photo_line/${id}/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
    });
    return response;
}

export const fetchWithTokenInterceptor = async (id, access) => {
    try {
        let response = await getPhotoLine(id, access)
        if (response.status === 401 || response.status === 403) {
            await tokenRefreshCreate()
                .then(res => res.json())
                .then(res => {
                    if (res.refresh != undefined) {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = getPhotoLine(id, res.access);
                    }
                })
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};