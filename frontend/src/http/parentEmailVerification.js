export const parentEmailVerification = async (code,email) => {
    const url = 'https://photodetstvo.easydev-program.com/api/v1/parent/email_verification_code/';

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
