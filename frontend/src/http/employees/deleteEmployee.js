import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const deleteEmployee = async ({ access, employeeId }) => {
    const url = `${localUrl}/api/crm/v1/roles/employees/${employeeId}/`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
};

export const deleteEmployeeWithTokenInterceptor = async (access, employeeId) => {
    try {
        let response = await deleteEmployee({ access, employeeId });
        if (!response.ok) {
            const createToken = await tokenRefreshCreate();
            if (createToken.ok) {
                const res = await createToken.json();
                if (res.refresh !== undefined) {
                    setCookie('refresh', res.refresh);
                    localStorage.setItem('access', res.access);
                    response = await deleteEmployee({ access: res.access, employeeId });
                }
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении DELETE запроса:', error);
        throw error;
    }
};
