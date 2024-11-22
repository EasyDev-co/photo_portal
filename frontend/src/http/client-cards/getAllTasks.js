
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";


export const getAllTasks = async (access, filters = {}) => {
    let url = `${localUrl}/api/crm/v2/client_cards/tasks/`

    const queryParams = new URLSearchParams();

    if (filters.managers && filters.managers.length > 0) {
        console.log(filters)
        const managerIds = filters.managers.map(manager => manager.id).join(',');
        console.log(managerIds)
        queryParams.append('executor', managerIds);
    }

    if (filters.selectedType) {
        console.log(filters.selectedType)
        queryParams.append('task_type', filters.selectedType);
    }

    if (filters.selectedDate) {
        queryParams.append('date_end', filters.selectedDate);
    }

    // Если есть фильтры, добавляем их к URL
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}

export const fetchAllTaskWithTokenInterceptor = async ({ access, filters }) => {
    try {
        let response = await getAllTasks(access, filters)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = getAllTasks(res.access, filters);
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