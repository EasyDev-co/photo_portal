
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";
// author, call_status, created_at, client_card

export const postCall = async ({access, data}) => {
    const url = `${localUrl}/api/crm/v1/client_cards/history-calls/`;

    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
            // "call_status": {call_status},
            // "created_at": {created_at},
            // "author": {author},
            // "client_card": {client_card}
        },
        body: JSON.stringify(data)

    });
    return response;
}

export const postCallWithToken = async (access, data) => {
    try {
        let response = await postCall(access, data)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = postCall(res.access, data);
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