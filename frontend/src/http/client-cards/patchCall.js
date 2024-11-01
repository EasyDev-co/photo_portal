
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const patchCall = async (access, callId, data) => {
    const url = `${localUrl}/api/crm/v1/client_cards/history-calls/${callId}/`;

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

export const patchCallWithToken = async (access, callId, data) => {
    try {
        let response = await patchCall(access, callId, data)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = patchCall(res.access, callId, data);
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