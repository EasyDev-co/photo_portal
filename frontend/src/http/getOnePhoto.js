import { localUrl } from "../constants/constants";

export const getOnePhoto = async (num,acces) => {
    const url = `${localUrl}/api/v1/photo/photo/${num}/`;
    
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
    });
    return response;
}
