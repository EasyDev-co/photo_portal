
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const deleteBasicTask = async (access, taskID) => {
    const url = `${localUrl}/api/crm/v1/client_cards/client-card-tasks/${taskID}/`;

    const response = await fetch(url, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }

    });
    return response;
}

export const deleteBasicTaskWithToken = async (access, taskID) => {
    try {
        let response = await deleteBasicTask(access, taskID)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = deleteBasicTask(res.access, taskID);
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