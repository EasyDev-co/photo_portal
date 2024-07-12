import { getCookie } from "../utils/setCookie";

export const tokenRefreshCreate = () => {
    const url = 'https://photodetstvo.easydev-program.com:8080/api/v1/parent/token_refresh/';

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
