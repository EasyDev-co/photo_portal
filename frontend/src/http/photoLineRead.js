import { addAccessTokenToHeaders } from "./addAccessToken";

export const photoLineRead = async (id) => {
    const url = `http://127.0.0.1:8080/api/v1/photo/photo/${id}/`;

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
