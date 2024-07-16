import { localUrl } from "../constants/constants";
import { getCookie } from "../utils/setCookie";


export const tokenRefreshCreate = (refresh) => {
    const url = `${localUrl}/api/v1/parent/token_refresh/`;

    const sendData = {
       refresh: refresh || getCookie('refresh')
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
