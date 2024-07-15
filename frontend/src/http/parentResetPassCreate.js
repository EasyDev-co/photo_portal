export const parentResetPassCreate = async (email) => {
    const url = 'https://photodetstvo.easydev-program.com/api/v1/parent/reset_password/';

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
