import { localUrl } from "../../constants/constants";

export const OAuth = async (provider) => {

    const url = `${localUrl}/api/oauth/v1/login/${provider}`;
    const response = await fetch(url, {
        method: "GET",
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response;
}

export const OAuthGetToken = async (data) => {

    const url = `${localUrl}/api/oauth/v1/login/oauth_token/`;
    const response = await fetch(url, {
        method: "POST",
        // mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${access}`
        },
        body:JSON.stringify(data)
    });
    return response;
}

