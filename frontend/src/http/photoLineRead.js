import { addAccessTokenToHeaders } from "./addAccessToken";

export const photoLineRead = async (id) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/photo/photo/${id}/`;

    const sendData = {
        id:id
    };
    const headers = addAccessTokenToHeaders({})
    const response = await fetch(url, {
        headers: {
            headers
        },
        body: JSON.stringify(sendData)
    });
    return response;
}
