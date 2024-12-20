import { localUrl } from "../../constants/constants";

export const getOrdersManager = async (photoThemeId, kindergartenId, access) => {
   
    const url = `${localUrl}/api/v1/orders/${photoThemeId}/${kindergartenId}/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}