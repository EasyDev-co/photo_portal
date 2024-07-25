import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { patchPhotoLine } from "./patchPhotoLine";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const getPhotoLine = async (id, access) => {
    const url = `${localUrl}/api/v1/photo/photo_line/${id}/`;

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
        if (response.status === 401 || response.status === 403)  {
            localStorage.setItem('access','');
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = getPhotoLine(id, res.access);
                    })
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};