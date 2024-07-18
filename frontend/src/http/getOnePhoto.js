export const getOnePhoto = async (num,access) => {
    const url = `http://127.0.0.1:8080/api/v1/photo/photo/${num}/`;
   
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`
        },
    });
    return response;
}
