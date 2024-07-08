export const userPartialUpdate = async (acces, obj) => {
    const url = `http://127.0.0.1:8080/api/v1/user/`;
   
    const response = await fetch(url, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
        body: JSON.stringify(obj)
    });
    return response;
}