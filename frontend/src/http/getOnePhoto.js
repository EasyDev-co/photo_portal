import { localUrl } from "../constants/constants";

export const getOnePhoto = async (num,access) => {
    const url = `${localUrl}/api/v1//photo/photo_line_by_numbers/`;
    
    const sendData = {
        number: num
    }
    const response = await fetch(url, {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(sendData)
    });
    return response;
}
