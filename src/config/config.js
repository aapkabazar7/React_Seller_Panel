// export const baseURL = 'https://devsellerapi.aapkabazar.co/api/seller/';
export const baseURL = 'http://13.201.147.168:13000/api/seller/';
export const liveURL = 'https://sellerapi.aapkabazar.co/api/seller';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q';
export const headers = {
    headers: {
        'x-access-token': token
    }
};
export const pageLimit = 40