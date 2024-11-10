
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const postBasicTask = async ({access, data}) => {
    const url = `${localUrl}/api/crm/v2/client_cards/tasks/`;

    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(data)

    });
    
    return response;
}

export const postBasicTaskWithToken = async (access, data) => {
    try {
        let response = await postBasicTask({access, data})
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = postBasicTask(res.access, data);
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