export const addAccessTokenToHeaders = (headers) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
  
    return headers;
};