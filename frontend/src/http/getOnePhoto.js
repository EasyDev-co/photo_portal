export const getOnePhoto = async (num,acces) => {
    const url = `https://photodetstvo.easydev-program.com/api/v1/photo/photo/${num}/`;
   
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acces}`
        },
    });
    return response;
}
