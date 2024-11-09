import { localUrl } from "../../constants/constants";

export const updateEmployeeData = async (employeeId, data, access) => {
    const url = `${localUrl}/api/crm/v1/roles/employees/${employeeId}/`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to update employee:', errorData);
            throw new Error(`Error ${response.status}: ${errorData.detail || 'Unknown error'}`);
        }

        const responseData = await response.json();
        console.log('Employee updated successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Failed to update employee:', error.message);
        throw error;
    }
};
