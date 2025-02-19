import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Replace with your backend URL
});

// Add a request interceptor to include token in headers
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
