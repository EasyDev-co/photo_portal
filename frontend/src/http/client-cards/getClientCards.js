import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const clientCards = async (access, filters = {}) => {
    let url = `${localUrl}/api/crm/v1/client_cards/client-cards/`;

    const queryParams = new URLSearchParams();

    if (filters.managers && filters.managers.length > 0) {
        const managerIds = filters.managers.map(manager => manager.id).join(',');
        queryParams.append('responsible_manager', managerIds);
    }

    if (filters.selectedRegion) {
        queryParams.append('region', filters.selectedRegion);
    }

    if (filters.selectedKindergarten) {
        queryParams.append('kindergarten', filters.selectedKindergarten);
    }

    if (filters.selectedDate) {
        queryParams.append('modified__date', filters.selectedDate);
    }

    // Если есть фильтры, добавляем их к URL
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
        },
    });

    return response;
};


export const fetchClientCardsWithTokenInterceptor = async ({ access, filters }) => {
    try {
        let response = await clientCards(access, filters);
        if (!response.ok) {
            const createToken = await tokenRefreshCreate();
            if (createToken.ok) {
                const res = await createToken.json();
                if (res.refresh !== undefined) {
                    setCookie('refresh', res.refresh);
                    localStorage.setItem('access', res.access);
                    response = await clientCards(res.access, filters);
                }
            }
        }

        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};
