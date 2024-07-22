import { localUrl } from "../constants/constants";

export const parentLoginCreate = async (email, password) => {
    const url = `${localUrl}/api/v1/parent/login/`;

    const sendData = {
        email: email,
        password: password
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
