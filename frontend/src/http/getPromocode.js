import { localUrl } from "../constants/constants";
import { setCookie } from "../utils/setCookie";
import { tokenRefreshCreate } from "./parent/tokenRefreshCreate";

export const getPromocode = async (access) => {
   
    const url = `${localUrl}/api/v1/promocode/get_manager_promocode/`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });
    return response;
}