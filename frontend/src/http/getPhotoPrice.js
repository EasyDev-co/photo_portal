import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./tokenRefreshCreate";

export const getPhotoPrice = async (acces,region) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/photo_price_by_region/`;

    const sendData = {
        region: region
    }
    const response = await fetch(url, {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
        body: JSON.stringify(sendData)

    });
    return response;
}

export const fetchPhotoPriceWithTokenInterceptor = async (access, region) => {
    try {
        let response = await getPhotoPrice(access, region)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        console.log(res)
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = getPhotoPrice(res.access, region);
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