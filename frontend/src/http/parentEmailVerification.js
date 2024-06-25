export const parentEmailVerification = async (code,email) => {
    const url = 'http://127.0.0.1:8001/api/v1/parent/email_verification_code/';

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
