import { localUrl } from "../constants/constants";

export const orderCreate = async (access) => {
    const url = `${localUrl}/api/v1/order/`;
    
    const response = await fetch(url, {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        // body: JSON.stringify()
    });
    return response;
}
