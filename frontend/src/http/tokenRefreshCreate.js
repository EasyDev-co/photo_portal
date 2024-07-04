import { getCookie } from "../utils/setCookie";
import { setCookie } from "../utils/setCookie";

export const tokenRefreshCreate = async () => {
    const url = 'http://127.0.0.1:8080/api/v1/parent/token_refresh/';

    const sendData = {
       refresh: getCookie('refresh')
    };
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sendData.refresh}`
        },
        body: JSON.stringify(sendData)
    })
    return response
}
