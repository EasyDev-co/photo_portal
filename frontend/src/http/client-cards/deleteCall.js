
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const deleteCall = async (access, callID) => {
    const url = `${localUrl}/api/crm/v1/client_cards/history-calls/${callID}/`;

    const response = await fetch(url, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },

    });
    return response;
}

export const deleteCallWithToken = async (access, callID) => {
    try {
        let response = await deleteCall(access, callID)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = deleteCall(res.access, callID);
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