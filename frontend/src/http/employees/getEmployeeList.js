import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const employees = async ({ access, ids }) => {
    // Проверяем, передан ли список ID, и формируем URL с параметром фильтрации
    const url = ids && ids.length > 0
        ? `${localUrl}/api/crm/v1/roles/employees/?ids=${ids.join(',')}`
        : `${localUrl}/api/crm/v1/roles/employees/`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
};


export const fetchEmployeesWithTokenInterceptor = async ({ access, ids }) => {
    try {
        let response = await employees({ access, ids });
        if (!response.ok) {
            const createToken = await tokenRefreshCreate();
            if (createToken.ok) {
                const res = await createToken.json();
                if (res.refresh !== undefined) {
                    setCookie('refresh', res.refresh);
                    localStorage.setItem('access', res.access);
                    response = await employees({ access: res.access, ids });
                }
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};
