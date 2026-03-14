import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const userInfoInfo = localStorage.getItem('userInfo');
  if (userInfoInfo) {
    const userInfo = JSON.parse(userInfoInfo);
    if (userInfo && userInfo.token) {
        req.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return req;
});

export default API;
