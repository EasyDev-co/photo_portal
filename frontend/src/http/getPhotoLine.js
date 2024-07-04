export const getPhotoLine = async (id,acces) => {
    const url = `http://127.0.0.1:8080/api/v1/photo/photo_line/${id}/`;
   
    const response = await fetch(url, {
        headers: {
             'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
    });
    return response;
}
