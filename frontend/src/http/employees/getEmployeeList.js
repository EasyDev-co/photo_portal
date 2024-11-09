import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const employees = async ({access}) => {
    const url = `${localUrl}/api/crm/v1/roles/employees/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}

export const fetchEmployeeskWithTokenInterceptor = async (access) => {
    try {
        let response = await employees(access)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = employees(res.access);
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