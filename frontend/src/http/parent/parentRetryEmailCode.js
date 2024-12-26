import { localUrl } from "../../constants/constants";

export const parentRetryEmailCode = async (email) => {
    const url = `${localUrl}/api//v1/parent/retry_email_code/`;

    const sendData = {
        email: email,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData)
    });
    return response;
}
