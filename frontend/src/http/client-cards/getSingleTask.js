
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const singleTask = async ({access, taskId}) => {
    const url = `${localUrl}/api/crm/v1/client_cards/client-card-tasks/${taskId}/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}

export const fetchsingleTaskWithTokenInterceptor = async (access, taskId) => {
    try {
        let response = await singleTask(access, taskId)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = singleTask(res.access, taskId);
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