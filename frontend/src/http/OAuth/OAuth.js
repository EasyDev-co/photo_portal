import { localUrl } from "../../constants/constants";

export const OAuth = async (provider) => {
    const url = `${localUrl}/api/oauth/v1/login/${provider}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Проверка ответа
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json(); // или просто return response, если вам нужно полное тело ответа
}

export const OAuthGetToken = async (data) => {
    const url = `${localUrl}/api/oauth/v1/login/oauth_token/`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${access}` // если нужно
        },
        body: JSON.stringify(data)
    });

    // Проверка ответа
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json(); // или просто return response, если вам нужно полное тело ответа
}
