
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const patchBasicTask = async (access, data, taskId) => {
    const url = `${localUrl}/api/crm/v2/client_cards/tasks/${taskId}/`;

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

export const patchBasicTaskWithToken = async (access, data, taskId) => {
    try {
        let response = await patchBasicTask(access, data, taskId)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = patchBasicTask(res.access, taskId, data);
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