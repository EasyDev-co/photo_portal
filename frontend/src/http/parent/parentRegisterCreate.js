import { localUrl } from "../../constants/constants";

export const parentRegisterCreate = async (email, first_name, second_name, last_name, password, kindergarten_code) => {
    const url = `${localUrl}/api/v1/parent/register/`;

    const sendData = {
        email: email,
        first_name: first_name,
        second_name: second_name,
        last_name: last_name,
        password: password,
        role: 1,
        kindergarten_code: kindergarten_code
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
