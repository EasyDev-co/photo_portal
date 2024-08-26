import { localUrl } from "../../constants/constants";

export const parentEmailVerification = async (code,email) => {
    const url = `${localUrl}/api/v1/parent/email_verification_code/`;

    const sendData = {
        email: email,
        code: code
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
