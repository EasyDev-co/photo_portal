export const parentLoginCreate = async (email, password) => {
    const url = 'https://photodetstvo.easydev-program.com/api/v1/parent/login/';

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
