
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const patchNote = async (access, noteId, data) => {
    const url = `${localUrl}/api/crm/v1/client_cards/notes/${noteId}/`;

    const response = await fetch(url, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(data)

    });
    return response;
}

export const patchNoteWithToken = async (access, noteId, data) => {
    try {
        let response = await patchNote(access, noteId, data)
        if (!response.ok) {
            let createToken = await tokenRefreshCreate()
            if (createToken.ok) {
                createToken.json()
                    .then(res => {
                        if (res.refresh !== undefined) {
                            setCookie('refresh', res.refresh);
                            localStorage.setItem('access', res.access);
                            response = patchNote(res.access, noteId, data);
                        }
                    })
            }

        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};