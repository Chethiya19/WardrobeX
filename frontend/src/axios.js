import axios from 'axios';

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true 
});

export default api;