import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "./../parent/tokenRefreshCreate";

export const downloadPhoto = async (id, access) => {
    const url = `${localUrl}/api/v1/photo/download_photo/${id}/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
    });
    return response;
}

export const fetchDownloadPhotoWithInterceptor = async (id, access) => {
    try {
        let response = await downloadPhoto(id, access)
        if (response.status === 401 || response.status === 403)  {
            // localStorage.setItem('access','');
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        setCookie('refresh', res.refresh);
                        localStorage.setItem('access', res.access);
                        response = downloadPhoto(id, res.access);
                    })
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};