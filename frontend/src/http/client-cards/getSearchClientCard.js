
import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const getSingleClientCard = async (access, name) => {
    const url = `${localUrl}/api/crm/v1/client_cards/search/?kindergarten_name=${name}`;

    console.log(name);
    

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        }
    });

    return response;
}


export const fetchSingleClientCardWithToken = async (access, name) => {
    try {
        console.log('Access token:', access, 'Name:', name);
        let response = await getSingleClientCard(access, name);
        if (!response.ok) {
            const createToken = await tokenRefreshCreate();
            if (createToken.ok) {
                const res = await createToken.json();
                if (res.access) {
                    localStorage.setItem('access', res.access);
                    response = await getSingleClientCard(res.access, name); // Добавлен await
                } else {
                    console.error('Failed to refresh token:', res);
                }
            }
        }
        return response;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};

// export const fetchSingleClientCardWithToken = async (access, name) => {
//     try {
//         console.log("Name in fetchSingleClientCardWithToken", name)
//         let response = await getSingleClientCard(access, name)
//         if (!response.ok) {
//             let createToken = await tokenRefreshCreate()
//             if (createToken.ok) {
//                 createToken.json()
//                     .then(res => {
//                         if (res.refresh !== undefined) {
//                             setCookie('refresh', res.refresh);
//                             localStorage.setItem('access', res.access);
//                             response = getSingleClientCard(res.access, name);
//                         }
//                     })
//             }

//         }
//         return response;
//     } catch (error) {
//         console.error('Ошибка при выполнении запроса:', error);
//         throw error;
//     }
// };