import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // ⬅️ allow cookies to be sent
});

export default api;