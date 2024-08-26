import { localUrl } from "../../constants/constants";


export const patchPhotoLine = async (access, obj, id) => {
    const url = `${localUrl}/api/v1/photo/photo_line/${id}/`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(obj)
    });
    return response;
}