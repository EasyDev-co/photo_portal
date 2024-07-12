import { getCookie } from "../utils/setCookie";

export const tokenRefreshCreate = () => {
    const url = 'http://127.0.0.1:8080/api/v1/parent/token_refresh/';

    const sendData = {
       refresh: getCookie('refresh')
    };
    const response = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData)
    })

    return response
}
