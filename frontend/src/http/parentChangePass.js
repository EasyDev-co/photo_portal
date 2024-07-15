export const parentChangePass = async (code,email,newPass) => {
    const url = 'https://photodetstvo.easydev-program.com/://127.0.0.1:8080/api/v1/parent/change_password/';

    const sendData = {
        email: email,
        code: code,
        new_password: newPass
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
