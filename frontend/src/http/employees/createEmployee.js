import { localUrl } from "../../constants/constants";

export const createEmployee = async (data, access) => {
    const url = `${localUrl}/api/crm/v1/roles/employees/`;
    console.log('Создаем сотрудника с данными:', data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка создания сотрудника:', errorData);
            throw new Error(`Ошибка ${response.status}: ${errorData.detail || 'Неизвестная ошибка'}`);
        }

        const responseData = await response.json();
        console.log('Сотрудник успешно создан:', responseData);
        return responseData;
    } catch (error) {
        console.error('Не удалось создать сотрудника:', error.message);
        throw error;
    }
};
