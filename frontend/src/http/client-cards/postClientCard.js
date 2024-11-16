import { localUrl } from "../../constants/constants";
import { setCookie } from "../../utils/setCookie";
import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

export const clientCardCreate = async (access, data) => {
    const url = `${localUrl}/api/crm/v1/client_cards/client-cards/`;

    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка создания карточки клиента: ${response.status} ${errorText}`);
    }

    return response.json();
};

export const postClientCardWithToken = async (access, data) => {
    try {
        let result;
        try {
            result = await clientCardCreate(access, data);
        } catch (error) {
            if (error.message.includes('401')) {
                const createToken = await tokenRefreshCreate();
                if (!createToken.ok) {
                    throw new Error(`Не удалось обновить токен: ${createToken.status}`);
                }

                const res = await createToken.json();
                if (res.refresh) {
                    setCookie('refresh', res.refresh);
                    localStorage.setItem('access', res.access);
                    result = await clientCardCreate(res.access, data);
                }
            } else {
                throw error; // Для других ошибок повторно выбрасываем
            }
        }
        return result;
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
};



// import { localUrl } from "../../constants/constants";
// import { setCookie } from "../../utils/setCookie";
// import { tokenRefreshCreate } from "../parent/tokenRefreshCreate";

// export const clientCardCreate = async (access, data) => {
//     const url = `${localUrl}/api/crm/v1/client_cards/client-cards/`;

//     const response = await fetch(url, {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${access}`
//         },
//         body: JSON.stringify(data)

//     });
    
//     return response;
// }

// export const postClientCardWithToken = async (access, data) => {
//     try {
//         let response = await clientCardCreate(access, data)
//         if (!response.ok) {
//             let createToken = await tokenRefreshCreate()
//             if (createToken.ok) {
//                 createToken.json()
//                     .then(res => {
//                         if (res.refresh !== undefined) {
//                             setCookie('refresh', res.refresh);
//                             localStorage.setItem('access', res.access);
//                             response = clientCardCreate(res.access, data);
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