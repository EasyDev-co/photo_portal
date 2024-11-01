
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const clientCardPatch = async (access, clientCardId, data) => {
    const url = `${localUrl}/api/crm/v1/client_cards/client-cards/${clientCardId}/`;

    const response = await fetch(url, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(data)

    });
    return response;
}

export const patchClientCardWithToken = async (access, clientCardId, data) => {
    try {
        let response = await clientCardPatch(access, clientCardId, data)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = clientCardPatch(res.access, clientCardId, data);
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